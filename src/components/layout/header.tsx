"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Mobile logo — hidden on desktop where sidebar shows it */}
      <Link href="/dashboard" className="text-xl font-bold lg:hidden">
        Clause
      </Link>
      <div className="lg:flex-1" />
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
