// navData.ts
export type NavItemConfig = {
  id: string;
  label: string;
  href: string;
  type: "simple" | "mega" | "dropdown";
  columns?: {
    heading?: string;
    links: { label: string; href: string; description?: string }[];
  }[];
};

export const navData: NavItemConfig[] = [
  {
    id: "markets",
    label: "Markets",
    href: "/markets",
    type: "mega",
    columns: [
      {
        heading: "Industries",
        links: [
          {
            label: "Telecom",
            href: "/telecom",
            description: "Powering connectivity",
          },
          {
            label: "Utilities",
            href: "/utilities",
            description: "Grid support systems",
          },
          {
            label: "EV Charging",
            href: "/ev",
            description: "Off-grid charging",
          },
        ],
      },
      {
        heading: "Regions",
        links: [
          { label: "North America", href: "/na" },
          { label: "EMEA", href: "/emea" },
          { label: "APAC", href: "/apac" },
        ],
      },
    ],
  },
  {
    id: "company",
    label: "Company",
    href: "/company",
    type: "dropdown",
    columns: [
      {
        links: [
          { label: "About Us", href: "/about" },
          { label: "Sustainability", href: "/sustainability" },
          { label: "Careers", href: "/careers" },
          { label: "Investors", href: "/investors" },
        ],
      },
    ],
  },
  { id: "products", label: "Products", href: "/products", type: "simple" },
  { id: "resources", label: "Resources", href: "/resources", type: "simple" },
];
