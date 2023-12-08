/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Popover } from "@headlessui/react";
import { Bars4Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import type { RefObject } from "react";
import { navMenu } from "./navigation-data";

const className = "block py-2 px-3 font-semibold rounded-md hover:bg-gray-100";

export const navMenuButtonIcon = (isOpen?: boolean) => {
  if (isOpen) {
    return XMarkIcon;
  }

  return Bars4Icon;
};

interface NavigationMenuPopoverProps {
  open?: boolean;
  popoverButtonRef?: RefObject<HTMLButtonElement>;
}

export function NavigationMenuPopover(props: NavigationMenuPopoverProps) {
  return (
    <Popover.Panel
      className="fixed top-16 bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-xl z-10"
      unmount
    >
      <nav className="flex flex-col w-full h-full flex-1 p-2 bg-white text-gray-900 overflow-auto">
        <ul className="space-y-2">
          {navMenu.map((item) => {
            return (
              <li key={item.name}>
                {item.external ? (
                  <a
                    className={className}
                    href={item.href}
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                  >
                    {item.name}
                  </a>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      clsx(className, isActive ? "bg-gray-100" : "")
                    }
                  >
                    {item.name}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </Popover.Panel>
  );
}
