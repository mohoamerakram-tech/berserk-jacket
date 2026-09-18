/**
 * Interface representing an anime series partner logo in the animated marquee
 */
export interface AnimeLogo {
  id: string;
  name: string;
  logo: string;
  href?: string;
}

/**
 * Interface for primary navigation menu items
 */
export interface NavLink {
  label: string;
  href: string;
}

/**
 * List of featured anime franchises displayed inside the expandable marquee drawer
 */
export const ANIME_LOGOS: AnimeLogo[] = [
  {
    id: 'berserk',
    name: 'Berserk',
    logo: '/images/logos/berserk.png',
    href: '/anime/berserk',
  },
  {
    id: 'bleach',
    name: 'Bleach',
    logo: '/images/logos/bleach.png',
    href: '/anime/bleach',
  },
  {
    id: 'death-note',
    name: 'Death Note',
    logo: '/images/logos/death-note.png',
    href: '/anime/death-note',
  },
  {
    id: 'dragon-ball',
    name: 'Dragon Ball',
    logo: '/images/logos/dragon-ball.png',
    href: '/anime/dragon-ball',
  },
  {
    id: 'hunter-x-hunter',
    name: 'Hunter x Hunter',
    logo: '/images/logos/hunter-x-hunter.png',
    href: '/anime/hunter-x-hunter',
  },
  {
    id: 'naruto',
    name: 'Naruto',
    logo: '/images/logos/naruto.png',
    href: '/anime/naruto',
  },
  {
    id: 'one-piece',
    name: 'One Piece',
    logo: '/images/logos/one-piece.png',
    href: '/anime/one-piece',
  },
  {
    id: 'chi',
    name: 'Chi: On the Movements of the Earth',
    logo: '/images/logos/chi.png',
    href: '/anime/chi',
  },
];

/**
 * Top-level navigation routes for the header and mobile menu
 */
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Collection', href: '/collection' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Archive', href: '/archive' },
];

