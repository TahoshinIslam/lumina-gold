'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Boxes,
  CircleDollarSign,
  ExternalLink,
  FolderTree,
  Gem,
  Images,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Ruler,
  ShoppingBag,
  Star,
  TicketPercent,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/animate-ui/components/radix/sidebar';
import { logoutAction } from './actions';

const GROUPS = [
  {
    label: 'Catalogue',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/products', label: 'Products', icon: Gem },
      { href: '/admin/categories', label: 'Categories', icon: FolderTree },
      { href: '/admin/sizes', label: 'Sizes', icon: Ruler },
      { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
    ],
  },
  {
    label: 'Storefront',
    items: [
      { href: '/admin/home', label: 'Home Models', icon: Images },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { href: '/admin/customers', label: 'Customers', icon: Users },
      { href: '/admin/reviews', label: 'Reviews', icon: Star },
      { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
      { href: '/admin/offers', label: 'Offers', icon: TicketPercent },
      { href: '/admin/rates', label: 'Gold Rates', icon: CircleDollarSign },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="adm-brand">
          NAHAR JEWELLERS
          <small>ADMIN PANEL</small>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {GROUPS.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      // /admin would otherwise light up on every sub-route.
                      isActive={
                        item.href === '/admin'
                          ? pathname === '/admin'
                          : pathname.startsWith(item.href)
                      }
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="View store">
              <Link href="/" target="_blank">
                <ExternalLink />
                <span>View store</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={logoutAction}>
              <SidebarMenuButton type="submit" tooltip="Sign out" className="w-full">
                <LogOut />
                <span>Sign out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
