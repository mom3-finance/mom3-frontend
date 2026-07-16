export function DegenDogeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="24" cy="24" r="20" fill="#D9A441" />
      <path d="M12 20 6 10l13 5" fill="#C9862A" />
      <path d="m36 20 6-10-13 5" fill="#C9862A" />
      <path
        d="M14 29c2.2 6 17.8 6 20 0"
        stroke="#7A4517"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path d="M23 25h2l-1 1.4L23 25Z" fill="#5B3212" />
      <path d="M13 20h10v6H13zM25 20h10v6H25z" fill="#0A0A0A" />
      <path
        d="M23 22h2"
        stroke="#0A0A0A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15 21.5h6M27 21.5h6"
        stroke="#ccff00"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity=".9"
      />
      <path
        d="M17 31c2.7 2.7 11.3 2.7 14 0"
        stroke="#FFF2C2"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
