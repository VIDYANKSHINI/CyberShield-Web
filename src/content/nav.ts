// src/content/nav.ts
export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavColumn = {
  heading?: string;
  links: NavLink[];
};

export type NavItem = {
  id: string;
  label: string;
  href?: string;
  type: "simple" | "mega" | "dropdown";
  columns?: NavColumn[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: "events",
    label: "Events",
    type: "simple",
    href: "/events",
  },
  {
    id: "gallery",
    label: "Gallery",
    type: "simple",
    href: "/gallery",
  },
  { id: "Team", label: "Team", href: "/team", type: "simple" },
  { id: "About us", label: "About us", href: "/about", type: "simple" },
];
