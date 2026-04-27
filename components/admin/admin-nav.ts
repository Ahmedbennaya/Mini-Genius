import type { LucideIcon } from "lucide-react";
import {
  ChartNoAxesCombined,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  TicketPercent,
  Image,
  Settings,
  ExternalLink,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produits", href: "/admin/products", icon: Package },
  { label: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { label: "Collections", href: "/admin/collections", icon: Tags },
  { label: "Clients", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
  { label: "Medias", href: "/admin/media", icon: Image },
  { label: "Analytics", href: "/admin/analytics", icon: ChartNoAxesCombined },
  { label: "Parametres", href: "/admin/settings", icon: Settings },
];

export const ADMIN_SECONDARY_NAV: AdminNavItem[] = [
  { label: "Voir le site", href: "/", icon: ExternalLink },
];
