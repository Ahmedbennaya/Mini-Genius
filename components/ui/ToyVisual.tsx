"use client";

import { PALETTE_HEX } from "@/data/site";
import type { Palette, ToyShape } from "@/data/products";

type Props = {
  shape: ToyShape;
  palette: Palette;
  className?: string;
  size?: number;
};

export default function ToyVisual({ shape, palette, className = "", size = 220 }: Props) {
  const { bg, deep } = PALETTE_HEX[palette];

  const gradId = `g-${shape}-${palette}`;
  const shadowId = `s-${shape}-${palette}`;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="35%" stopColor={bg} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1F2433" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1F2433" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="100" cy="172" rx="62" ry="9" fill={`url(#${shadowId})`} />

      {/* shape */}
      <ToyShapeBody shape={shape} fill={`url(#${gradId})`} accent={deep} />
    </svg>
  );
}

function ToyShapeBody({
  shape,
  fill,
  accent,
}: {
  shape: ToyShape;
  fill: string;
  accent: string;
}) {
  switch (shape) {
    case "cube":
      return (
        <>
          <rect x="42" y="42" rx="22" ry="22" width="116" height="116" fill={fill} />
          <text
            x="100"
            y="118"
            textAnchor="middle"
            fontFamily="'Bricolage Grotesque', sans-serif"
            fontSize="56"
            fontWeight="700"
            fill="#FFFFFF"
            opacity="0.92"
          >
            A
          </text>
        </>
      );
    case "blocks":
      return (
        <>
          <rect x="34" y="98" rx="14" ry="14" width="60" height="60" fill={fill} />
          <rect x="106" y="74" rx="14" ry="14" width="60" height="84" fill={accent} opacity="0.88" />
          <rect x="62" y="46" rx="12" ry="12" width="46" height="46" fill="#FFFFFF" opacity="0.72" />
        </>
      );
    case "puzzle":
      return (
        <path
          d="M50 60c0-8 6-14 14-14h22c2-10 8-14 14-14s12 4 14 14h22c8 0 14 6 14 14v22c10 2 14 8 14 14s-4 12-14 14v22c0 8-6 14-14 14h-22c-2 10-8 14-14 14s-12-4-14-14H64c-8 0-14-6-14-14v-22c-10-2-14-8-14-14s4-12 14-14V60z"
          fill={fill}
        />
      );
    case "balls":
      return (
        <>
          <circle cx="72" cy="92" r="32" fill={fill} />
          <circle cx="132" cy="76" r="22" fill={accent} opacity="0.9" />
          <circle cx="124" cy="132" r="28" fill="#FFFFFF" opacity="0.85" />
          <circle cx="78" cy="146" r="18" fill={accent} opacity="0.7" />
        </>
      );
    case "rocket":
      return (
        <>
          <path
            d="M100 28c22 18 32 44 32 78l-14 14H82l-14-14c0-34 10-60 32-78z"
            fill={fill}
          />
          <circle cx="100" cy="80" r="14" fill="#FFFFFF" opacity="0.9" />
          <path d="M68 130l-22 14 14-32 8 6z" fill={accent} opacity="0.85" />
          <path d="M132 130l22 14-14-32-8 6z" fill={accent} opacity="0.85" />
          <rect x="86" y="148" width="10" height="14" rx="3" fill={accent} />
          <rect x="104" y="148" width="10" height="14" rx="3" fill={accent} />
        </>
      );
    case "board":
      return (
        <>
          <rect x="32" y="46" rx="20" ry="20" width="136" height="108" fill={fill} />
          <circle cx="68" cy="86" r="14" fill="#FFFFFF" opacity="0.85" />
          <rect x="96" y="74" rx="6" ry="6" width="64" height="22" fill={accent} opacity="0.85" />
          <rect x="48" y="118" rx="6" ry="6" width="48" height="22" fill="#FFFFFF" opacity="0.7" />
          <circle cx="138" cy="128" r="14" fill={accent} opacity="0.8" />
        </>
      );
    case "cards":
      return (
        <>
          <rect x="42" y="56" rx="14" ry="14" width="92" height="118" fill={accent} opacity="0.85" transform="rotate(-8 88 115)" />
          <rect x="58" y="46" rx="14" ry="14" width="92" height="118" fill={fill} transform="rotate(4 104 105)" />
          <rect x="66" y="40" rx="14" ry="14" width="92" height="118" fill="#FFFFFF" opacity="0.92" transform="rotate(12 112 99)" />
        </>
      );
    case "gift":
      return (
        <>
          <rect x="38" y="74" rx="14" ry="14" width="124" height="92" fill={fill} />
          <rect x="92" y="74" width="16" height="92" fill={accent} />
          <path
            d="M60 74c-12 0-22-12-12-22 8-8 30 4 40 22h-28zm80 0c12 0 22-12 12-22-8-8-30 4-40 22h28z"
            fill={accent}
          />
          <rect x="38" y="74" width="124" height="14" fill="#FFFFFF" opacity="0.35" />
        </>
      );
    case "ring":
      return (
        <>
          <circle cx="100" cy="100" r="62" fill={fill} />
          <circle cx="100" cy="100" r="30" fill="#FBF6EE" />
        </>
      );
    case "ball":
      return (
        <>
          <circle cx="100" cy="100" r="62" fill={fill} />
          <ellipse cx="80" cy="78" rx="20" ry="12" fill="#FFFFFF" opacity="0.6" />
        </>
      );
    default:
      return <circle cx="100" cy="100" r="62" fill={fill} />;
  }
}
