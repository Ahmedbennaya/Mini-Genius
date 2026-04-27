import type { Product } from "@/data/products";
import type { Order, OrderStatus } from "@/lib/orders";

export type AdminOrderStatus = OrderStatus;
export type AdminOrder = Order;

export type Coupon = {
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder?: number;
  active: boolean;
  usageCount: number;
  usageLimit?: number;
  expiresAt?: string;
  createdAt: string;
};

export type MediaAsset = {
  id: string;
  name: string;
  url: string;
  kind: "image" | "video";
  sizeKb: number;
  createdAt: string;
};

export type AdminSettings = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: "TND";
  shippingStandardFee: number;
  shippingExpressFee: number;
  freeShippingThreshold?: number;
  whatsappNumber: string;
  deliveryText?: string;
  paymentText?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  maintenanceMode: boolean;
  updatedAt: string;
};

export type ProductInput = Omit<Product, "id"> & { id?: string };

export type CustomerSnapshot = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string;
};
