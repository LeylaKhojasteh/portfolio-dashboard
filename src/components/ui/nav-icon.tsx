interface NavIconProps {
  name: string;
  className?: string;
}

const iconPaths: Record<string, React.ReactNode> = {
  Warehouse: (
    <>
      <path d="M2 7.5V22h20V7.5L12 2 2 7.5Z" />
      <path d="M6 16v6h6v-6H6Z" />
      <path d="M12 16v6h6v-6h-6Z" />
      <path d="M9 10v6h6v-6H9Z" />
    </>
  ),
  "Investing-And-Banking": (
    <>
      <path d="M8.5 12V6h7V2.5L22 9l-6.5 6.5V12h-7Z" />
      <path d="M15.5 18v-6h-7V8.5L2 15l6.5 6.5V18h7Z" />
    </>
  ),
  Baggage: (
    <>
      <path d="M17 7v-0.2A4.8 4.8 0 0 0 12.2 2h-0.4A4.8 4.8 0 0 0 7 6.8V7" />
      <path d="M2 7h20v15H2z" />
      <path d="m5.5 7 0 15" />
      <path d="m18.5 7 0 15" />
    </>
  ),
  "Signal-Full": (
    <>
      <path d="M2.5 16H9v3.5H2.5z" />
      <path d="M9 9.5h6.5v10H9z" />
      <path d="M15.5 2.5h6v17h-6z" />
      <path d="M1 22h22" />
    </>
  ),
  Sun: (
    <>
      <path d="m9 5 3 -3 3 3h4v4l3 3 -3 3v4h-4l-3 3 -3 -3H5v-4l-3 -3 3 -3V5h4Z" />
      <path d="M8.5 12a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0 -7 0" />
    </>
  ),
  "Login-2": (
    <>
      <path d="M2 12a9 9 0 1 0 18 0 9 9 0 0 0 -18 0Z" />
      <path d="M23 12H9" />
      <path d="m13 8 -4 4 4 4" />
      <path d="M19.064 8a9 9 0 1 0 0 8" />
    </>
  ),
  "Logout-2": (
    <>
      <path d="M2 12a9 9 0 1 0 18 0 9 9 0 0 0 -18 0Z" />
      <path d="M17.708 6a9 9 0 1 0 0 12" />
      <path d="M22 12H8" />
      <path d="m18 8 4 4 -4 4" />
    </>
  ),
};

const VIEW_BOX = "0 0 24 24";

export function NavIcon({ name, className }: NavIconProps) {
  const paths = iconPaths[name];
  if (!paths) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEW_BOX}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      {paths}
    </svg>
  );
}
