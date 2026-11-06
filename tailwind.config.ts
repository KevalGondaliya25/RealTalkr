import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/content/**/*.{md,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        border: {
          DEFAULT: "var(--border)",
          2: "var(--border-2)",
        },
        black: {
          DEFAULT: "var(--black)",
          2: "var(--black-2)",
          "old-2": "var(--black-old-2)",
        },
        white: {
          DEFAULT: "var(--white)",
          2: "var(--white-2)",
          3: "var(--white-3)",
        },
        theme: {
          DEFAULT: "var(--theme)",
          10: "var(--theme-10)",
          50: "var(--theme-50)",
          100: "var(--theme-100)",
          300: "var(--theme-300)",
          500: "var(--theme-500)",
          800: "var(--theme-800)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          100: "var(--primary-100)",
          foreground: "hsl(var(--primary-foreground))",
        },
        teal: {
          DEFAULT: "var(--teal)",
        },
        navyblue: {
          DEFAULT: "var(--navy-blue)",
          100: "var(--navy-blue-100)",
          300: "var(--navy-blue-300)",
          500: "var(--navy-blue-500)",
          800: "var(--navy-blue-800)",
        },
        charcoal: {
          DEFAULT: "var(--charcoal)",
          100: "var(--charcoal-100)",
          300: "var(--charcoal-300)",
          500: "var(--charcoal-500)",
          800: "var(--charcoal-800)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        action: {
          DEFAULT: "var(--action)",
        },
        gray: {
          DEFAULT: "var(--gray)",
          2: "var(--gray-2)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "hsl(var(--destructive-foreground))",
        },
        sec_bg: {
          DEFAULT: "var(--sec_bg)",
          2: "var(--sec_bg-2)",
          3: "var(--sec_bg-3)",
        },
        btn: {
          "bg-main": "var(--btn-bg-main)",
          "bg-hover": "var(--btn-bg-hover)",
          "text-main": "var(--btn-text-main)",
          "text-hover": "var(--btn-text-hover)",
          "bg-hover2": "var(--btn2-bg-hover)",
          "text-hover2": "var(--btn2-text-hover)",
          border: "var(--btn-border)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",

          "red-400": "var(--chart-red-400)",
          "amber-400": "var(--chart-amber-400)",
          "emerald-400": "var(--chart-emerald-400)",
          "sky-400": "var(--chart-sky-400)",
          "violet-400": "var(--chart-violet-400)",
          "rose-400": "var(--chart-rose-400)",
          "cyan-400": "var(--chart-cyan-400)",
          "orange-400": "var(--chart-orange-400)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        primary: ["DM Sans", "sans-serif"],
        colasta: ["colasta"],
        instrument: ["Instrument Sans", "sans-serif"],
        pt_serif: ["PT Serif", "serif"],
        plus_jakarta_sans: ["Plus Jakarta Sans", "sans-serif"],
        onest: ["onest", "sans-serif"],
        tropiline: ["tropiline", "sans-serif"],
        beatrice: ["beatrice"],
        PPFragment: ["PPFragment"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        characters: {
          "0%,75%,100%": {
            opacity: "0",
            transform: "rotateY(-90deg)",
          },
          "25%,50%": {
            opacity: "1",
            transform: "rotateY(0deg)",
          },
        },
        "wc-y-anim": {
          "0%": {
            transform: "translateY(-30px)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "wc-y-anim": "wc-y-anim 3s ease-in-out infinite alternate",
      },
      transformOrigin: {
        "origin-1": "50% 0",
      },
      backgroundImage: {
        "gradient-180": "linear-gradient(180deg, var(--tw-gradient-stops))",
        "gradient-92": "linear-gradient(91.59deg, var(--tw-gradient-stops))",
        "gradient-120": "linear-gradient(120.51deg, var(--tw-gradient-stops))",
        "gradient-160": "linear-gradient(160deg, var(--tw-gradient-stops))",
        "gradient-105": "linear-gradient(105.52deg, var(--tw-gradient-stops))",
        "gradient-89": "linear-gradient(89.68deg, var(--tw-gradient-stops))",
        "gradient-105-full":
          "linear-gradient(105.52deg, #FF856A 0%, #FFED4E 34%, #4BFFF4 69%, #7F52FF 100%)",
        "gradient-135-full":
          "linear-gradient(135deg, rgba(255, 133, 107, 1) 0%, rgba(255, 228, 69, 1) 33%, rgba(81, 252, 255, 1) 66%, rgba(125, 89, 255, 1) 100%)",
      },
      boxShadow: {
        integration: "10px 10px 45px rgba(0, 0, 0, 0.07)",
      },
      dropShadow: {
        1: "0px 30px 30px rgba(28, 32, 49, 0.13)",
        2: "0px -30px 50px rgba(40, 41, 54, 0.15)",
        3: "0px 40px 50px rgba(23, 34, 63, 0.1)",
        4: "0px 40px 50px rgba(34, 40, 72, 0.08)",
      },
      borderRadius: {
        theme: "20px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      variants: {
        space: ["responsive", "direction"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@xpd/tailwind-3dtransforms"),
    require("@pyncz/tailwind-mask-image"),
    require("tailwindcss-dir"),
  ],
} satisfies Config;

export default config;
