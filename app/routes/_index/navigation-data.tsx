import type * as React from "react";

import { HomeIcon } from "@heroicons/react/24/outline";

export interface NavigationItem {
  name: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  href: string;
  exact?: boolean;
  external?: boolean;
}

export type NavMenuItem = Omit<NavigationItem, "icon">;

export const bottomNavigation: NavigationItem[] = [
  {
    name: "Beranda",
    icon: HomeIcon,
    href: "/",
    exact: true,
  },
];

export const navMenu: NavMenuItem[] = [
  {
    name: "Beranda",
    href: "/",
    exact: true,
  },
];
