import Image from "next/image";

type PhoneMockProps = {
  children?: React.ReactNode;
  className?: string;
  /** Extra classes for the screen surface (e.g. background color). */
  screenClassName?: string;
  /** Use light status-bar content for dark screens. */
  dark?: boolean;
  /** Optional aria label for the device */
  label?: string;
};

/**
 * PhoneMock — displays the phone mockup image from public/image.png
 */
export default function PhoneMock({
  children,
  className = "",
  screenClassName = "bg-white",
  dark = false,
  label = "Mobile app preview",
}: PhoneMockProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative mx-auto w-full max-w-[320px] ${className}`}
    >
      <Image
        src="/images.png"
        alt={label}
        width={320}
        height={690}
        className="w-full h-auto"
        priority
      />
      {children && (
        <div className="absolute inset-0 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}
