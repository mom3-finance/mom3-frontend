import { AgentAvatar } from "./AgentAvatar";

export function ThinkingMessage() {
  return (
    <div className="flex gap-3">
      <AgentAvatar />
      <div className="rounded-[22px] rounded-bl-md bg-[#1C1C1E] px-4 py-3 text-sm font-bold text-[#9A9AA2]">
        Thinking...
      </div>
    </div>
  );
}
