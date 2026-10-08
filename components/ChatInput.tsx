"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<boolean | void> | boolean | void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message here...",
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount if not disabled
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      const trimmedText = text.trim();
      if (!trimmedText || isSubmitting || disabled) {
        return;
      }

      // Immediately clear the input for instant responsiveness
      setText("");
      setIsSubmitting(true);

      try {
        await onSendMessage(trimmedText);
      } catch (err) {
        console.error("Failed to send message from ChatInput:", err);
      } finally {
        setIsSubmitting(false);
        // Maintain keyboard focus for seamless follow-up messages
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    },
    [text, isSubmitting, disabled, onSendMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isSendDisabled = disabled || isSubmitting || !text.trim();

  return (
    <form onSubmit={handleSubmit} className="chat-input-bar">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="on"
        autoCapitalize="sentences"
        spellCheck={true}
        enterKeyHint="send"
        className="chat-text-input"
        maxLength={2000}
      />
      <button
        type="submit"
        className="send-message-btn"
        disabled={isSendDisabled}
        aria-label="Send message"
        title="Send message"
      >
        {isSubmitting ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          <i className="fas fa-paper-plane"></i>
        )}
      </button>
    </form>
  );
}
