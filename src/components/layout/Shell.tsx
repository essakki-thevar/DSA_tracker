import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <Sidebar />
      <div className="flex-1 md:ml-60 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}
