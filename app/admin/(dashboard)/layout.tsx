import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminEmail, isAdminAuthenticated } from "@/lib/admin/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  return <AdminShell adminEmail={getAdminEmail()}>{children}</AdminShell>;
}
