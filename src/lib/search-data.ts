// lib/search-data.ts

import { Product, ProductBadge, ProductReview } from "@/types/product";

export type SearchItem = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  // rating: number;

  review: ProductReview;
  badge?: ProductBadge;

  reviews: number;
  tag?: "New" | "Sale" | "Hot";
};

export const DUMMY_SEARCH_ITEMS: Product[] = [
  {
    id: 1,
    name: "Merino Wool Crewneck",
    brand: "Aether",
    category: "fashion",
    price: 128,
    originalPrice: 160,
    image: "#C9B99A",
    review: {
      rating: 4.9,
      count: 214,
    },
    tag: "Sale",
  },
  {
    id: 2,
    name: "Relaxed Linen Trousers",
    brand: "Noma",
    category: "fashion",
    price: 95,
    image: "#B8C4B8",
    review: {
      rating: 4.8,
      count: 203,
    },
    tag: "New",
  },
  {
    id: 3,
    name: "Leather Derby Shoe",
    brand: "Tricker's",
    category: "fashion",
    price: 340,
    image: "#8B7355",
    review: {
      rating: 4.8,
      count: 412,
    },
    tag: "Hot",
  },
  {
    id: 4,
    name: "Oversized Oxford Shirt",
    brand: "Lemaire",
    category: "fashion",
    price: 210,
    originalPrice: 280,
    image: "#D4C5B0",
    review: {
      rating: 4.8,
      count: 812,
    },
    tag: "Sale",
    isTrending: true,
  },
  {
    id: 5,
    name: "Canvas Tote Bag",
    brand: "Hender Scheme",
    category: "fashion",
    price: 145,
    image: "#E8E0D5",
    review: {
      rating: 4,
      count: 412,
    },
  },
  {
    id: 6,
    name: "Ribbed Cotton Tee",
    brand: "Our Legacy",
    category: "fashion",
    price: 78,
    image: "#F5F0E8",
    review: {
      rating: 4.9,
      count: 122,
    },
    tag: "New",
    isTrending: true,
  },
  {
    id: 7,
    name: "Waxed Field Jacket",
    brand: "Barbour",
    category: "fashion",
    price: 420,
    image: "#4A5240",
    review: {
      rating: 4.5,
      count: 499,
    },
    tag: "Hot",
  },
  {
    id: 8,
    name: "Slim Selvedge Denim",
    brand: "Oni Denim",
    category: "fashion",
    price: 265,
    image: "#2C3E5D",
    review: {
      rating: 4.8,
      count: 412,
    },
  },
  {
    id: 9,
    name: "Suede Chelsea Boot",
    brand: "R.M. Williams",
    category: "fashion",
    price: 395,
    originalPrice: 450,
    image: "#9B7B5C",
    review: {
      rating: 4.3,
      count: 524,
    },
    tag: "Sale",
  },
  {
    id: 10,
    name: "Brushed Flannel Shirt",
    brand: "Gitman Vintage",
    category: "fashion",
    price: 155,
    image: "#B5694A",
    review: {
      rating: 4.8,
      count: 312,
    },
    tag: "New",
  },
  {
    id: 11,
    name: "Wool Felt Beret",
    brand: "Lock & Co.",
    category: "fashion",
    price: 85,
    image: "#2B2B2B",
    review: {
      rating: 3.8,
      count: 409,
    },
  },
  {
    id: 12,
    name: "Double-faced Wool Coat",
    brand: "Sandro",
    category: "fashion",
    price: 590,
    image: "#E2D9CE",
    review: {
      rating: 4.8,
      count: 234,
    },
    tag: "Hot",
  },
  {
    id: 14,
    name: "Sports car spoiler",
    brand: "Toyota",
    category: "automotive",
    price: 590,
    image: "#E2D9CE",
    review: {
      rating: 4.4,
      count: 234,
    },
    tag: "New",
  },
];