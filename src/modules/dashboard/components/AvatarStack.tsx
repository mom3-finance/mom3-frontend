import { avatarStackColors } from "../constants/dashboard";

export function AvatarStack({ label }: { label: string }) {
  return (
    <div className="mt-4 flex items-center">
      <div className="flex -space-x-2">
        {avatarStackColors.map((color, index) => (
          <span
            key={color}
            className={`h-6 w-6 rounded-full border-2 border-[#1C1C1E] ${color}`}
            aria-hidden="true"
          >
            <span className="sr-only">User {index + 1}</span>
          </span>
        ))}
      </div>
      <span className="ml-2.5 text-[11px] font-semibold text-[#9A9AA2]">
        {label}
      </span>
    </div>
  );
}
