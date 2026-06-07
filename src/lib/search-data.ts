// lib/search-data.ts

export type SearchItem = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string; // placeholder color for dummy
  rating: number;
  reviews: number;
  tag?: "New" | "Sale" | "Hot";
};

export const DUMMY_SEARCH_ITEMS: SearchItem[] = [
  {
    id: 1,
    name: "Merino Wool Crewneck",
    brand: "Aether",
    category: "Knitwear",
    price: 128,
    originalPrice: 160,
    image: "#C9B99A",
    rating: 4.8,
    reviews: 214,
    tag: "Sale",
  },
  {
    id: 2,
    name: "Relaxed Linen Trousers",
    brand: "Noma",
    category: "Bottoms",
    price: 95,
    image: "#B8C4B8",
    rating: 4.6,
    reviews: 87,
    tag: "New",
  },
  {
    id: 3,
    name: "Leather Derby Shoe",
    brand: "Tricker's",
    category: "Footwear",
    price: 340,
    image: "#8B7355",
    rating: 4.9,
    reviews: 412,
    tag: "Hot",
  },
  {
    id: 4,
    name: "Oversized Oxford Shirt",
    brand: "Lemaire",
    category: "Tops",
    price: 210,
    originalPrice: 280,
    image: "#D4C5B0",
    rating: 4.7,
    reviews: 156,
    tag: "Sale",
  },
  {
    id: 5,
    name: "Canvas Tote Bag",
    brand: "Hender Scheme",
    category: "Accessories",
    price: 145,
    image: "#E8E0D5",
    rating: 4.5,
    reviews: 63,
  },
  {
    id: 6,
    name: "Ribbed Cotton Tee",
    brand: "Our Legacy",
    category: "Tops",
    price: 78,
    image: "#F5F0E8",
    rating: 4.4,
    reviews: 298,
    tag: "New",
  },
  {
    id: 7,
    name: "Waxed Field Jacket",
    brand: "Barbour",
    category: "Outerwear",
    price: 420,
    image: "#4A5240",
    rating: 4.9,
    reviews: 731,
    tag: "Hot",
  },
  {
    id: 8,
    name: "Slim Selvedge Denim",
    brand: "Oni Denim",
    category: "Bottoms",
    price: 265,
    image: "#2C3E5D",
    rating: 4.8,
    reviews: 189,
  },
  {
    id: 9,
    name: "Suede Chelsea Boot",
    brand: "R.M. Williams",
    category: "Footwear",
    price: 395,
    originalPrice: 450,
    image: "#9B7B5C",
    rating: 4.9,
    reviews: 524,
    tag: "Sale",
  },
  {
    id: 10,
    name: "Brushed Flannel Shirt",
    brand: "Gitman Vintage",
    category: "Tops",
    price: 155,
    image: "#B5694A",
    rating: 4.6,
    reviews: 112,
    tag: "New",
  },
  {
    id: 11,
    name: "Wool Felt Beret",
    brand: "Lock & Co.",
    category: "Accessories",
    price: 85,
    image: "#2B2B2B",
    rating: 4.7,
    reviews: 44,
  },
  {
    id: 12,
    name: "Double-faced Wool Coat",
    brand: "Sandro",
    category: "Outerwear",
    price: 590,
    image: "#E2D9CE",
    rating: 4.8,
    reviews: 267,
    tag: "Hot",
  },
];

export const SEARCH_CATEGORIES = [
  "All",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Footwear",
  "Knitwear",
  "Accessories",
];