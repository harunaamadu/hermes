// src/app/(shop)/dashboard/bag/_data/bag-data.ts

export type CartItem = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  color: string;
  colorLabel: string;
  size: string;
  quantity: number;
  swatch: string; // hex color for placeholder
  tag?: "New" | "Sale" | "Low Stock";
};

export type WishlistItem = Omit<CartItem, "quantity" | "size"> & {
  sizes: string[];
  inCart?: boolean;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "cash"
  | "card"
  | "mobile_money"
  | "paypal";

export interface PurchaseHistory {
  id: string;
  orderNumber: string;

  totalItems: number;
  quantity: number;
  totalAmount: number;

  status: OrderStatus;
  paymentMethod: PaymentMethod;

  createdAt: Date | string;
  updatedAt?: Date | string;
}

export const DUMMY_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Waxed Field Jacket",
    brand: "Barbour",
    category: "Outerwear",
    price: 420,
    color: "#4A5240",
    colorLabel: "Olive",
    size: "M",
    quantity: 1,
    swatch: "#4A5240",
    tag: "Low Stock",
  },
  {
    id: 2,
    name: "Slim Selvedge Denim",
    brand: "Oni Denim",
    category: "Bottoms",
    price: 265,
    color: "#2C3E5D",
    colorLabel: "Indigo",
    size: "32 / 32",
    quantity: 1,
    swatch: "#2C3E5D",
  },
  {
    id: 3,
    name: "Merino Wool Crewneck",
    brand: "Aether",
    category: "Knitwear",
    price: 128,
    originalPrice: 160,
    color: "#C9B99A",
    colorLabel: "Sand",
    size: "L",
    quantity: 2,
    swatch: "#C9B99A",
    tag: "Sale",
  },
  {
    id: 4,
    name: "Leather Derby Shoe",
    brand: "Tricker's",
    category: "Footwear",
    price: 340,
    color: "#8B7355",
    colorLabel: "Tan",
    size: "EU 43",
    quantity: 1,
    swatch: "#8B7355",
  },
];

export const DUMMY_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 5,
    name: "Double-faced Wool Coat",
    brand: "Sandro",
    category: "Outerwear",
    price: 590,
    color: "#E2D9CE",
    colorLabel: "Ecru",
    sizes: ["XS", "S", "M", "L"],
    swatch: "#E2D9CE",
    tag: "New",
  },
  {
    id: 6,
    name: "Suede Chelsea Boot",
    brand: "R.M. Williams",
    category: "Footwear",
    price: 395,
    originalPrice: 450,
    color: "#9B7B5C",
    colorLabel: "Cognac",
    sizes: ["EU 40", "EU 41", "EU 42", "EU 44"],
    swatch: "#9B7B5C",
    tag: "Sale",
  },
  {
    id: 7,
    name: "Relaxed Linen Trousers",
    brand: "Noma",
    category: "Bottoms",
    price: 95,
    color: "#B8C4B8",
    colorLabel: "Sage",
    sizes: ["S", "M", "L", "XL"],
    swatch: "#B8C4B8",
    tag: "New",
  },
  {
    id: 8,
    name: "Wool Felt Beret",
    brand: "Lock & Co.",
    category: "Accessories",
    price: 85,
    color: "#2B2B2B",
    colorLabel: "Charcoal",
    sizes: ["One Size"],
    swatch: "#2B2B2B",
  },
  {
    id: 9,
    name: "Canvas Tote Bag",
    brand: "Hender Scheme",
    category: "Accessories",
    price: 145,
    color: "#E8E0D5",
    colorLabel: "Natural",
    sizes: ["One Size"],
    swatch: "#E8E0D5",
  },
  {
    id: 10,
    name: "Oversized Oxford Shirt",
    brand: "Lemaire",
    category: "Tops",
    price: 210,
    originalPrice: 280,
    color: "#D4C5B0",
    colorLabel: "Ivory",
    sizes: ["XS", "S", "M"],
    swatch: "#D4C5B0",
    tag: "Sale",
    inCart: true,
  },
];

export const DUMMY_HISTORY: PurchaseHistory[] = [
  {
    id: "ORD-001",
    orderNumber: "#1001",
    totalItems: 3,
    quantity: 5,
    totalAmount: 450,
    status: "delivered",
    paymentMethod: "mobile_money",
    createdAt: new Date("2026-05-20T14:30:00"),
  },
  {
    id: "ORD-002",
    orderNumber: "#1002",
    totalItems: 2,
    quantity: 2,
    totalAmount: 180,
    status: "processing",
    paymentMethod: "card",
    createdAt: new Date("2026-06-04T09:15:00"),
  },
];