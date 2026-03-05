"use client";

import { useState, ReactNode } from "react";
import Sidebar, { SidebarContext } from "./Sidebar";

export default function LayoutShell({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((o) => !o);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <Sidebar />
      <main className="lg:ml-[180px] min-h-screen transition-all duration-300">
        {children}
      </main>
    </SidebarContext.Provider>
  );
}
