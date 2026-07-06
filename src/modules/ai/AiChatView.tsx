"use client";

import { MobileBottomBar, MobileHeader, MobileShell } from "@/components/ui/mobile-shell";
import { recommendations } from "./constants/ai";
import { AgentAvatar } from "./components/AgentAvatar";
import { ChatBubble } from "./components/ChatBubble";
import { ChatComposer } from "./components/ChatComposer";
import { ChatEmptyState } from "./components/ChatEmptyState";
import { RecommendationList } from "./components/RecommendationList";
import { StrategyResponse } from "./components/StrategyResponse";
import { ThinkingMessage } from "./components/ThinkingMessage";
import { useAiChat } from "./hooks/useAiChat";

export default function AiChatView() {
  const { input, isThinking, messages, setInput, sendMessage, showRecommendations } =
    useAiChat();

  return (
    <MobileShell
      contentClassName="pb-32 pt-20"
      bottomSlot={
        <MobileBottomBar>
          <ChatComposer
            input={input}
            isSubmitting={isThinking}
            onInputChange={setInput}
            onSubmit={sendMessage}
          />
        </MobileBottomBar>
      }
    >
      <MobileHeader
        title="mom3 /agent"
        backHref="/dashboard"
        backLabel="Back to dashboard"
      />
      {showRecommendations ? (
        <RecommendationList items={recommendations} onSelect={sendMessage} />
      ) : null}

      <section className="mt-6 space-y-4 pb-4">
        {messages.length === 0 && !isThinking ? <ChatEmptyState /> : null}

        {messages.map((message) => {
          const isUser = message.role === "user";

          if (message.kind === "strategy") {
            return (
              <div key={message.id} className="flex gap-3">
                <AgentAvatar className="mt-7 shadow-[0_0_0_4px_rgba(204,255,0,0.1)]" />
                <div className="min-w-0 flex-1">
                  <StrategyResponse />
                </div>
              </div>
            );
          }

          return (
            <ChatBubble
              key={message.id}
              content={message.content}
              isUser={isUser}
            />
          );
        })}

        {isThinking ? <ThinkingMessage /> : null}
      </section>
    </MobileShell>
  );
}
