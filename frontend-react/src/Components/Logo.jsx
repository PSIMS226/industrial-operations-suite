// Logo.jsx — Custom SVG logo: iron ingot with a shovel
export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 32 L14 18 L34 18 L40 32 Z"
        fill="var(--accent)"
        stroke="var(--accent-hover)"
        strokeWidth="1.5"
      />
      <path
        d="M14 18 L34 18 L36 22 L12 22 Z"
        fill="var(--accent-hover)"
        opacity="0.5"
      />
      <line
        x1="32" y1="6" x2="22" y2="26"
        stroke="var(--text-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M18 24 L26 24 L24 32 Q22 34 20 32 Z"
        fill="var(--text-primary)"
        stroke="var(--text-primary)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}