"use client";
import React from "react";

type Props = {
    name: string; // "anthropic" or "anthropic.svg"
    alt: string;
    className?: string;
};

function toBase(name: string) {
    return name.replace(/\.[a-z0-9]+$/i, ""); // strip extension if present
}

export default function IconImg({ name, alt, className }: Props) {
    const src = `/assets/icons/${toBase(name)}`;
    return <img src={src} alt={alt} className={className} />;
}