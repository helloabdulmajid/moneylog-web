export default function Logo({ size = 32, className = "" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-label="MoneyLog"
      className={className}
    >
      <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#1E4637" />
      <path
        d="M13 31.5 L13 18 M13 18 L24 31.5 M24 31.5 L34 17.5 M34 17.5 L34 31.5"
        fill="none"
        stroke="#F6F1E6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 36 L29 36"
        stroke="#C9D6C8"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M29 36 L37 36"
        stroke="#B4501E"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="36.5" cy="11.5" r="3" fill="#B4501E" />
    </svg>
  );
}