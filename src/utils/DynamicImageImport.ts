"use client";

import type { ComponentType, SVGProps } from "react";

import dynamic from "next/dynamic";

type SVGComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const Blockfire = dynamic(
  () => import("assets/images/works/blockfire/BlockfireLogo.svg"),
  { ssr: false },
) satisfies SVGComponent;

export const Negatifplus = dynamic(
  () => import("assets/images/works/negatifplus/NegatifplusLogo.svg"),
  { ssr: false },
) satisfies SVGComponent;

export const Stentor = dynamic(
  () => import("assets/images/works/stentor/StentorLogo.svg"),
  { ssr: false },
) satisfies SVGComponent;

export const Zefirent = dynamic(
  () => import("assets/images/works/zefirent/ZefirentLogo.svg"),
  { ssr: false },
) satisfies SVGComponent;

export const Discord = dynamic(() => import("assets/images/discord.svg"), {
  ssr: false,
}) satisfies SVGComponent;

export const GitHub = dynamic(() => import("assets/images/github.svg"), {
  ssr: false,
}) satisfies SVGComponent;

export const LinkedIn = dynamic(() => import("assets/images/linkedin.svg"), {
  ssr: false,
}) satisfies SVGComponent;
