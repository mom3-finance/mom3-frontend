import { IconAction } from "@/components/ui/icon-action";

type ChatComposerProps = {
  input: string;
  isSubmitting: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export function ChatComposer({
  input,
  isSubmitting,
  onInputChange,
  onSubmit,
}: ChatComposerProps) {
  const canSubmit = Boolean(input.trim()) && !isSubmitting;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(input);
      }}
      className="flex h-14 w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-[#1C1C1E]/95 p-2 shadow-[0_16px_44px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md"
      aria-busy={isSubmitting}
    >
      <IconAction icon="lucide:paperclip" label="Attach file" />

      <label htmlFor="ai-message" className="sr-only">
        Message mom3 agent
      </label>
      <input
        id="ai-message"
        type="text"
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        placeholder="Ask mom3 anything..."
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent text-base font-medium text-white placeholder:text-[#77777f] focus:outline-none"
      />

      <IconAction
        type="submit"
        icon="lucide:arrow-up"
        label="Send message"
        iconSize={20}
        iconClassName="[&_*]:stroke-[3]"
        tone="primary"
        disabled={!canSubmit}
      />
    </form>
  );
}
