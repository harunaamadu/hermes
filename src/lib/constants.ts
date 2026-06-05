// src/constants/navigation.ts

// =====================================================
// Utilities
// =====================================================

export const stringify = (value: unknown): string => {
  if (typeof value === "string") return value;
  return String(value ?? "");
};

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

// =====================================================
// Navigation
// =====================================================

export type MegaMenuSubItem = {
  name: string;
  href: string;
};

export type MegaMenuItem = {
  name: string;
  href: string;
  subItems?: MegaMenuSubItem[];
};

export type MegaMenuCard = {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
};

export type NavItem = {
  name: string;
  href: string;
  megaMenuItems?: MegaMenuItem[];
  megaMenuCards?: MegaMenuCard[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    name: "Motors",
    href: "/category/motors",
  },
  {
    name: "Today's Deals",
    href: "/deals",
  },
  {
    name: "Gift Cards",
    href: "/gift-cards",
  },
  {
    name: "Registry",
    href: "/registry",
  },
  {
    name: "Buy Again",
    href: "/buy-again",
  },
  {
    name: "Browsing History",
    href: "/history",
  },
  {
    name: "Coupons",
    href: "/coupons",
  },
  {
    name: "Customer Service",
    href: "/customer-service",
  },
  {
    name: "Sell",
    href: "/sell",
  },
];

// =====================================================
// Category
// =====================================================

export type CategoryItem = {
  name: string;
  href: string;
};

export type Category = {
  name: string;
  href: string;
  items: CategoryItem[];
};

export const CATEGORIES: Category[] = [
  {
    name: "Motors",
    href: "/category/motors",
    items: [
      {
        name: "Parts & Accessories",
        href: "/category/motors/parts-accessories",
      },
      {
        name: "Cars & Trucks",
        href: "/category/motors/cars-trucks",
      },
      {
        name: "Motorcycles",
        href: "/category/motors/motorcycles",
      },
      {
        name: "Other Vehicles",
        href: "/category/motors/other-vehicles",
      },
    ],
  },

  {
    name: "Clothing & Accessories",
    href: "/category/clothing-accessories",
    items: [
      {
        name: "Women",
        href: "/category/clothing-accessories/women",
      },
      {
        name: "Men",
        href: "/category/clothing-accessories/men",
      },
      {
        name: "Handbags",
        href: "/category/clothing-accessories/handbags",
      },
      {
        name: "Collectible Sneakers",
        href: "/category/clothing-accessories/sneakers",
      },
    ],
  },

  {
    name: "Sporting Goods",
    href: "/category/sporting-goods",
    items: [
      {
        name: "Golf Equipment",
        href: "/category/sporting-goods/golf",
      },
      {
        name: "Outdoor Sports",
        href: "/category/sporting-goods/outdoor",
      },
      {
        name: "Cycling Equipment",
        href: "/category/sporting-goods/cycling",
      },
      {
        name: "Hunting Equipment",
        href: "/category/sporting-goods/hunting",
      },
    ],
  },

  {
    name: "Electronics",
    href: "/category/electronics",
    items: [
      {
        name: "Computers & Tablets",
        href: "/category/electronics/computers",
      },
      {
        name: "Phones & Accessories",
        href: "/category/electronics/phones",
      },
      {
        name: "Gaming",
        href: "/category/electronics/gaming",
      },
      {
        name: "Cameras",
        href: "/category/electronics/cameras",
      },
    ],
  },

  {
    name: "Business & Industrial",
    href: "/category/business-industrial",
    items: [
      {
        name: "Buildings",
        href: "/category/business-industrial/buildings",
      },
      {
        name: "Inspection Equipment",
        href: "/category/business-industrial/inspection",
      },
      {
        name: "Heavy Equipment",
        href: "/category/business-industrial/heavy-equipment",
      },
      {
        name: "Food Service",
        href: "/category/business-industrial/food-service",
      },
    ],
  },

  {
    name: "Jewelry & Watches",
    href: "/category/jewelry-watches",
    items: [
      {
        name: "Luxury Watches",
        href: "/category/jewelry-watches/luxury-watches",
      },
      {
        name: "Wristwatches",
        href: "/category/jewelry-watches/wristwatches",
      },
      {
        name: "Fashion Jewelry",
        href: "/category/jewelry-watches/fashion-jewelry",
      },
      {
        name: "Fine Jewelry",
        href: "/category/jewelry-watches/fine-jewelry",
      },
    ],
  },

  {
    name: "Collectibles & Art",
    href: "/category/collectibles-art",
    items: [
      {
        name: "Trading Cards",
        href: "/category/collectibles-art/trading-cards",
      },
      {
        name: "Collectibles",
        href: "/category/collectibles-art/collectibles",
      },
      {
        name: "Coins & Paper Money",
        href: "/category/collectibles-art/coins",
      },
      {
        name: "Sports Memorabilia",
        href: "/category/collectibles-art/sports-memorabilia",
      },
    ],
  },

  {
    name: "Home & Garden",
    href: "/category/home-garden",
    items: [
      {
        name: "Garden & Outdoor",
        href: "/category/home-garden/garden",
      },
      {
        name: "Tools",
        href: "/category/home-garden/tools",
      },
      {
        name: "Home Improvement",
        href: "/category/home-garden/improvement",
      },
      {
        name: "Kitchen & Dining",
        href: "/category/home-garden/kitchen",
      },
    ],
  },

  {
    name: "Other Categories",
    href: "/categories",
    items: [
      {
        name: "Books, Movies & Music",
        href: "/category/books-movies-music",
      },
      {
        name: "Toys & Hobbies",
        href: "/category/toys-hobbies",
      },
      {
        name: "Health & Beauty",
        href: "/category/health-beauty",
      },
      {
        name: "Baby Essentials",
        href: "/category/baby",
      },
    ],
  },
];

export type CategoryFooterLink = {
  name: string;
  href: string;
};

export const CATEGORY_FOOTER_LINKS: CategoryFooterLink[] = [
  {
    name: "All Brands",
    href: "/brands",
  },
  {
    name: "All Categories",
    href: "/categories",
  },
  {
    name: "Seasonal Sales & Events",
    href: "/sales",
  },
];

// =====================================================
// Footer
// =====================================================

export type FooterLink = {
  name: string;
  href: string;
};

export const FOOTER_LINKS: FooterLink[] = [
  {
    name: "About Us",
    href: "/about",
  },
  {
    name: "Contact Us",
    href: "/contact",
  },
  {
    name: "Privacy Policy",
    href: "/privacy",
  },
  {
    name: "Terms & Conditions",
    href: "/terms",
  },
  {
    name: "Shipping Policy",
    href: "/shipping",
  },
  {
    name: "Returns & Refunds",
    href: "/returns",
  },
  {
    name: "Careers",
    href: "/careers",
  },
];

// =====================================================
// Device Detection
// =====================================================

export type DeviceType =
  | "mobile"
  | "tablet"
  | "desktop";

export const getDeviceType = (): DeviceType => {
  if (typeof window === "undefined") {
    return "desktop";
  }

  const width = window.innerWidth;

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";

  return "desktop";
};