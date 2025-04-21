import { getPermalink} from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'About Us', href: getPermalink('/about') },
    { text: 'Services', href: getPermalink('/services') },
    { text: 'Industries', href: getPermalink('/industries') },
    { text: 'Technologies', href: getPermalink('/technologies') },
    { text: 'Pricing', href: getPermalink('/pricing') },
    { text: 'Careers', href: getPermalink('/careers') },
    { text: 'Contact', href: getPermalink('/contact') },
  ],
  actions: [{ text: 'Get in Touch', href: getPermalink('/contact'), class: 'btn btn-primary' }],
};

export const footerData = {
  links: [
    {
      title: 'Company',
      links: [
        { text: 'Home', href: getPermalink('/') },
        { text: 'About Us', href: getPermalink('/about') },
        { text: 'Careers', href: getPermalink('/careers') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Services',
      links: [
        { text: 'Services', href: getPermalink('/services') },
        { text: 'Industries', href: getPermalink('/industries') },
        { text: 'Technologies', href: getPermalink('/technologies') },
        { text: 'Pricing', href: getPermalink('/pricing') },
      ],
    },
  ],

  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://linkedin.com' },
    { ariaLabel: 'Twitter', icon: 'tabler:brand-twitter', href: 'https://twitter.com' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://facebook.com' },
  ],
  footNote: `© ${new Date().getFullYear()} AA Cognitech. All rights reserved.`,
};