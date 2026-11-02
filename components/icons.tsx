import type { SVGProps } from "react";

/** Ícones do design. Todos decorativos (aria-hidden): o rótulo vem do texto ou do aria-label do botão. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Stroke({ size = 18, strokeWidth = 1.75, children, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

function Fill({ size = 18, children, ...rest }: IconProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
      {children}
    </svg>
  );
}

export const CheckIcon = (p: IconProps) => (
  <Stroke strokeWidth={2.4} {...p}>
    <path d="m5 12 4 4 10-10" />
  </Stroke>
);

export const HomeIcon = (p: IconProps) => (
  <Fill {...p}>
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </Fill>
);

export const ListChecksIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m3 17 2 2 4-4" />
    <path d="m3 7 2 2 4-4" />
    <path d="M13 6h8" />
    <path d="M13 12h8" />
    <path d="M13 18h8" />
  </Stroke>
);

export const ClockIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Stroke>
);

export const CalendarIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </Stroke>
);

export const BellIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Stroke>
);

export const BellFilledIcon = (p: IconProps) => (
  <Fill {...p}>
    <path d="M12 2a6 6 0 0 0-6 6c0 6.5-2.6 8.6-2.7 8.7A1 1 0 0 0 4 18.5h16a1 1 0 0 0 .7-1.8S18 14.5 18 8a6 6 0 0 0-6-6Zm-2.2 18a2.4 2.4 0 0 0 4.4 0Z" />
  </Fill>
);

export const BarChartIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M3 3v18h18" />
    <path d="M7 15v2" />
    <path d="M11 11v6" />
    <path d="M15 7v10" />
    <path d="M19 12v5" />
  </Stroke>
);

export const HistoryIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </Stroke>
);

export const LinkIcon = (p: IconProps) => (
  <Stroke strokeWidth={2} {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Stroke>
);

export const SearchIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Stroke>
);

export const SunIcon = ({ size = 16, ...p }: IconProps) => (
  <Stroke size={size} strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </Stroke>
);

export const MoonIcon = ({ size = 16, ...p }: IconProps) => (
  <Stroke size={size} strokeWidth={2} {...p}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Stroke>
);

export const PlusIcon = ({ strokeWidth = 2.2, ...p }: IconProps) => (
  <Stroke strokeWidth={strokeWidth} {...p}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Stroke>
);

export const CloseIcon = ({ size = 16, ...p }: IconProps) => (
  <Stroke size={size} strokeWidth={2} {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Stroke>
);

export const ChevronLeftIcon = ({ size = 16, ...p }: IconProps) => (
  <Stroke size={size} strokeWidth={2} {...p}>
    <path d="m15 18-6-6 6-6" />
  </Stroke>
);

export const ChevronRightIcon = ({ size = 16, ...p }: IconProps) => (
  <Stroke size={size} strokeWidth={2} {...p}>
    <path d="m9 18 6-6-6-6" />
  </Stroke>
);

export const DocIcon = (p: IconProps) => (
  <Fill {...p}>
    <path d="M5 3h10l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 9v2h8v-2Zm0 4v2h5v-2Z" />
  </Fill>
);

export const AlertIcon = (p: IconProps) => (
  <Fill {...p}>
    <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM11 9h2v5h-2Zm0 6.5h2v2h-2Z" />
  </Fill>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Fill {...p}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.2-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4Z" />
  </Fill>
);

export const PlayIcon = (p: IconProps) => (
  <Fill {...p}>
    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" />
  </Fill>
);

export const BarsIcon = (p: IconProps) => (
  <Fill {...p}>
    <rect x="4" y="11" width="4" height="9" rx="1.5" />
    <rect x="10" y="6" width="4" height="14" rx="1.5" />
    <rect x="16" y="13" width="4" height="7" rx="1.5" />
  </Fill>
);
