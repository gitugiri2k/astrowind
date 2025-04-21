import { isUnpicCompatible, unpicOptimizer, astroAsseetsOptimizer } from './images-optimization';
import type { ImageMetadata } from 'astro';
import type { OpenGraph } from '@astrolib/seo';

let cachedImages: Record<string, () => Promise<unknown>> | undefined;

/** Loads local images from the assets folder */
const loadImages = async (): Promise<typeof cachedImages> => {
  try {
    return import.meta.glob('~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}');
  } catch {
    return undefined;
  }
};

/** Caches and returns local image imports */
export const fetchLocalImages = async () => {
  if (!cachedImages) {
    cachedImages = await loadImages();
  }
  return cachedImages;
};

/** Finds and returns the correct image (as a URL or ImageMetadata) */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  if (typeof imagePath !== 'string') return imagePath;

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }

  if (!imagePath.startsWith('~/assets/images')) {
    return imagePath;
  }

  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  if (images && typeof images[key] === 'function') {
    const imported = (await images[key]()) as { default: ImageMetadata };
    return imported.default;
  }

  return null;
};

/** Adapts OpenGraph image objects with metadata or optimized URLs */
export const adaptOpenGraphImages = async (
  openGraph: OpenGraph = {},
  astroSite: URL = new URL('')
): Promise<OpenGraph> => {
  if (!openGraph.images?.length) return openGraph;

  const defaultWidth = 1200;
  const defaultHeight = 626;

  const adaptedImages = await Promise.all(
    openGraph.images.map(async (image) => {
      if (!image?.url) return { url: '' };

      const resolvedImage = await findImage(image.url);

      if (!resolvedImage) return { url: '' };

      // remote image with Unpic support
      if (typeof resolvedImage === 'string' && resolvedImage.startsWith('http') && isUnpicCompatible(resolvedImage)) {
        const [optimized] = await unpicOptimizer(resolvedImage, [defaultWidth], defaultWidth, defaultHeight, 'jpg');
        return formatImageObject(optimized, astroSite);
      }

      // local image metadata
      if (typeof resolvedImage !== 'string') {
        const useOriginalSize = resolvedImage.width && resolvedImage.width <= defaultWidth;
        const width = useOriginalSize ? resolvedImage.width : defaultWidth;
        const height = useOriginalSize ? resolvedImage.height : defaultHeight;

        const [optimized] = await astroAsseetsOptimizer(resolvedImage, [width], width, height, 'jpg');
        return formatImageObject(optimized, astroSite);
      }

      return { url: '' };
    })
  );

  return {
    ...openGraph,
    images: adaptedImages,
  };
};

/** Formats an optimized image object for OpenGraph */
function formatImageObject(
  image: { src?: string; width?: number; height?: number } | string,
  astroSite: URL
): { url: string; width?: number; height?: number } {
  if (typeof image !== 'object') return { url: '' };

  const url = image.src ? new URL(image.src, astroSite).toString() : '';
  return {
    url,
    width: image.width,
    height: image.height,
  };
}
