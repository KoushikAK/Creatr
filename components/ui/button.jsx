import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/convex/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        primary:
          "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xs",

        glass: `
          backdrop-blur-md bg-white/20 text-white 
          border border-white/30 shadow-md hover:bg-white/30 
          dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20
        `,

        subtle: `
          bg-muted text-muted-foreground hover:bg-muted/80 border border-border shadow-none
          dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:border-neutral-700
        `,

        elevated: `
          bg-background text-foreground shadow-md hover:shadow-lg transition-shadow
          dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-lg dark:hover:shadow-xl
        `,

        neon: `
          bg-black text-white border border-[#39ff14] hover:bg-[#39ff14] hover:text-black 
          shadow-[0_0_8px_#39ff14]
          dark:bg-neutral-950 dark:border-[#39ff14] dark:hover:bg-[#39ff14]/90 dark:hover:text-black
        `,

        gradient: `
          bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:opacity-90 shadow-md
          dark:from-pink-600 dark:via-red-600 dark:to-yellow-600 dark:text-white
        `,

        outlineDashed: `
          border-2 border-dashed border-primary text-primary hover:bg-primary/10
          dark:border-primary/80 dark:text-primary dark:hover:bg-primary/20
        `,

        pill: `
          rounded-full bg-primary text-primary-foreground px-6 hover:bg-primary/90 shadow-sm
          dark:bg-primary/80 dark:text-primary-foreground dark:hover:bg-primary/70
        `,

        // 🔥 New ones
        soft: `
          bg-primary/15 text-primary hover:bg-primary/25 
          dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30
        `,

        warning: `
          bg-amber-500 text-black hover:bg-amber-600 shadow-xs
          dark:bg-amber-600 dark:text-black dark:hover:bg-amber-500
        `,

        success: `
          bg-emerald-500 text-white hover:bg-emerald-600 shadow-xs
          dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500
        `,

        info: `
          bg-sky-500 text-white hover:bg-sky-600 shadow-xs
          dark:bg-sky-600 dark:text-white dark:hover:bg-sky-500
        `,

        glassGradient: `
          backdrop-blur-lg bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-white border border-white/20 
          hover:from-indigo-500/40 hover:to-purple-500/40
          dark:from-indigo-400/20 dark:to-purple-400/20 dark:hover:from-indigo-400/30 dark:hover:to-purple-400/30
        `,

        premiumGold: `
          relative bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 
          text-black font-semibold shadow-md transition-all duration-300 
          hover:from-yellow-500 hover:via-amber-600 hover:to-yellow-700 
          hover:scale-105 active:scale-95
          dark:from-yellow-500 dark:via-amber-600 dark:to-yellow-700 dark:text-black
        `,

        premiumSilver: `
          relative bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 
          text-black font-semibold shadow-md transition-all duration-300 
          hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 
          hover:scale-105 active:scale-95
          dark:from-gray-400 dark:via-gray-500 dark:to-gray-600 dark:text-white
        `,

        premiumDiamond: `
          relative bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 
          text-white font-semibold shadow-lg transition-all duration-300 
          hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-700 
          hover:scale-105 active:scale-95
          dark:from-cyan-500 dark:via-blue-600 dark:to-indigo-700
        `,

        premiumGlass: `
          relative backdrop-blur-xl bg-white/20 text-white border border-white/30 
          shadow-lg transition-all duration-300 
          hover:bg-white/30 hover:scale-105 active:scale-95
          dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20
        `,

        premiumGlow: `
          relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 
          text-white font-bold shadow-lg transition-all duration-300 
          hover:from-purple-700 hover:via-pink-700 hover:to-red-700 
          hover:scale-105 active:scale-95
          before:absolute before:inset-0 before:rounded-md before:p-[2px] before:bg-gradient-to-r before:from-purple-400 before:to-pink-400 before:opacity-75 
          before:-z-10
        `,

        premiumLuxury: `
          relative bg-gradient-to-br from-purple-700 via-violet-600 to-pink-600 
          text-white font-bold shadow-xl transition-all duration-300 
          hover:from-purple-800 hover:via-violet-700 hover:to-pink-700 
          hover:scale-105 active:scale-95
          dark:from-purple-800 dark:via-violet-700 dark:to-pink-700
        `,
        premiumShimmer: `
          relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 
          text-white font-bold shadow-lg transition-all duration-300 
          hover:scale-105 active:scale-95
          dark:from-purple-700 dark:via-pink-700 dark:to-red-700
          before:absolute before:inset-0 before:-translate-x-full 
          before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent 
          before:skew-x-12 
          before:transition-transform before:duration-700 
          hover:before:translate-x-full
        `,
        premiumShimmerLoop: `
          relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 
          text-white font-bold shadow-lg transition-all duration-300
          hover:scale-105 active:scale-95
          dark:from-purple-700 dark:via-pink-700 dark:to-red-700
          before:absolute before:inset-0 before:-translate-x-full 
          before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent 
          before:skew-x-12 
          before:animate-shimmer
        `,
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-md px-8 has-[>svg]:px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
