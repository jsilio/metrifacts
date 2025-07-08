"use client";

import { ChartSplineIcon } from "lucide-react";
import Link from "next/link";

import { AddMetricButton } from "@/components/add-metric-form";

export function Header() {
  return (
    <header className="border-border border-b">
      <nav className="mx-auto flex max-w-7xl flex-row items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <ChartSplineIcon className="size-8 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 p-1 text-white" />
          <Link
            href="/"
            className="font-bold font-mono text-3xl tracking-tight"
          >
            metrifacts
          </Link>
        </div>

        <AddMetricButton />
      </nav>
    </header>
  );
}
