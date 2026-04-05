import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function baseProps(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 18c1.7-3 4.1-4.5 6.5-4.5S16.8 15 18.5 18" />
    </svg>
  );
}

export function DynamicIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="12" r="2.5" />
      <circle cx="9" cy="16" r="2.5" />
      <path d="M10 9.5l3.8 1.8" />
      <path d="M9.8 13.6l4-1.3" />
    </svg>
  );
}

export function ReportsIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M5 18h14" />
      <path d="M7.5 15V9" />
      <path d="M12 15V6" />
      <path d="M16.5 15v-4" />
    </svg>
  );
}

export function StationIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 4v16" />
      <path d="M4 12h16" />
      <path d="M7 7l10 10" />
      <path d="M17 7 7 17" />
    </svg>
  );
}

export function MemoryIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6.5 6.5h7a3 3 0 0 1 3 3v8h-7a3 3 0 0 0-3 3z" />
      <path d="M6.5 6.5v14" />
      <path d="M9.5 10.5h5" />
      <path d="M9.5 13.5h4" />
    </svg>
  );
}

export function AvatarIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 3.8c4.9 0 8.2 3.3 8.2 8.2s-3.3 8.2-8.2 8.2S3.8 16.9 3.8 12 7.1 3.8 12 3.8Z" />
      <circle cx="12" cy="10" r="2.8" />
      <path d="M7.6 17.2c1.5-2 3-3 4.4-3s2.9 1 4.4 3" />
    </svg>
  );
}

export function FriendIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="9" cy="9.1" r="2.35" />
      <circle cx="15.6" cy="10.3" r="2.05" />
      <path d="M4.9 18.2c1.4-2.5 3.2-3.7 5.3-3.7s3.9 1.2 5.3 3.7" />
      <path d="M13 17.4c.8-1.5 2-2.3 3.5-2.3 1 0 1.9.3 2.8.9" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 19s-6-3.7-6-8.7c0-2.1 1.5-3.8 3.5-3.8 1.3 0 2.1.6 2.5 1.5.4-.9 1.2-1.5 2.5-1.5 2 0 3.5 1.7 3.5 3.8 0 5-6 8.7-6 8.7Z" />
    </svg>
  );
}

export function CommentIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6.5 7.5h11a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H12l-3.8 3v-3H6.5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function RepostIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 7h8l-2.5-2.5" />
      <path d="m15 7-2.5 2.5" />
      <path d="M17 17H9l2.5 2.5" />
      <path d="m9 17 2.5-2.5" />
      <path d="M15 7h1.2A1.8 1.8 0 0 1 18 8.8V12" />
      <path d="M9 17H7.8A1.8 1.8 0 0 1 6 15.2V12" />
    </svg>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7.5 5.5h9a1.5 1.5 0 0 1 1.5 1.5v11L12 14.5 6 18V7a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="11" cy="11" r="5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7.5 16.8h9" />
      <path d="M9 16.8v-4.1a3 3 0 0 1 6 0v4.1" />
      <path d="M9 12.7c0-2.8 1.1-4.5 3-5.2" />
      <path d="M15 12.7c0-2.8-1.1-4.5-3-5.2" />
      <path d="M10.3 19.2a1.9 1.9 0 0 0 3.4 0" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 3.8 13.8 9 19 10.8 13.8 12.6 12 17.8 10.2 12.6 5 10.8 10.2 9 12 3.8Z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.8v2.1" />
      <path d="M12 18.1v2.1" />
      <path d="m5.9 5.9 1.5 1.5" />
      <path d="m16.6 16.6 1.5 1.5" />
      <path d="M3.8 12h2.1" />
      <path d="M18.1 12h2.1" />
      <path d="m5.9 18.1 1.5-1.5" />
      <path d="m16.6 7.4 1.5-1.5" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M17.8 14.5a6.2 6.2 0 1 1-8.3-8.3A7 7 0 1 0 17.8 14.5Z" />
    </svg>
  );
}
