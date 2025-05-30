"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="" />
        <h1 className="text-lg font-semibold">Desafio técnico Anka Tech</h1>
      </div>
    </header>
  );
}
