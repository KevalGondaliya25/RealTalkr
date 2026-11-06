"use client";
import Navbar from "@/components/component/navbar/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <Navbar>{children}</Navbar>;
}
