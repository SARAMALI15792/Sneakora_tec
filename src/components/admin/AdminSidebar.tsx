"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  TicketPercent,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navItems = [
  {
    group: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    group: "Management",
    items: [
      { title: "Products", href: "/admin/products", icon: Package },
      { title: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { title: "Coupons", href: "/admin/coupons", icon: TicketPercent },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <Link
          href="/admin"
          className="flex items-center gap-2 px-2 py-1"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background text-xs font-bold">
            S
          </div>
          <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">
            Sneakora Admin
          </span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              {group.group}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Back to Store"
              onClick={() => router.push("/")}
            >
              <ArrowLeft />
              <span>Back to Store</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={async () => {
                await authClient.signOut();
                router.push("/sign-in");
              }}
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}