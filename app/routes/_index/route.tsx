import { Outlet } from "@remix-run/react";
import type { MetaFunction } from "@vercel/remix";
import { GlobalHeader } from "./global-header";

export const meta: MetaFunction = () => {
  return [
    { title: "Kawal Jejak" },
    { name: "description", content: "Mau suaraku? Buka datamu!" },
  ];
};

export default function Index() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-gray-100">
      <GlobalHeader />
      <Outlet />
    </main>
  );
}
