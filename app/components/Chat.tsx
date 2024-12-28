"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Vapi from "@vapi-ai/web";
import { getSitePrompt } from "../utils/getPDFPrompts";
import { PdfContent } from "../types/PdfContent";
import { createChatAssistant } from "./assistant/chat.assistant";
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_TOKEN!);

type ChatProps = {
  pdfText: string;
  isPdfUploaded: boolean;
};

const Chat: React.FC<ChatProps> = ({ pdfText, isPdfUploaded }) => {
  const [callStatus, setCallStatus] = useState<
    "inactive" | "loading" | "active"
  >("inactive");

  const { user } = useUser();
  const { openSignUp } = useClerk();

  const startVoiceChat = async () => {
    if (!user) {
      openSignUp();
      return;
    }

    setCallStatus("loading");
    const pdfContent: PdfContent = { pdfText };
    const prompts = getSitePrompt(pdfContent);

    const assistant = createChatAssistant(pdfContent);
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, assistant);
  };

  const stopVoiceChat = () => {
    setCallStatus("loading");
    vapi.stop();
  };

  useEffect(() => {
    vapi.on("call-start", () => setCallStatus("active"));
    vapi.on("call-end", () => setCallStatus("inactive"));

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  return (
    <div className="pdf-chat">
      <div className="pdf-chat-form">
        {callStatus === "inactive" && (
          <div className="pdf-mic-section">
            <button
              onClick={startVoiceChat}
              className={`pdf-mic-button ${
                !isPdfUploaded ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isPdfUploaded}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              <span>
                {isPdfUploaded ? "Start Voice Chat" : "Upload PDF First"}
              </span>
            </button>
          </div>
        )}
        {callStatus === "loading" && <div className="pdf-loading-spinner" />}
        {callStatus === "active" && (
          <div className="pdf-mic-section">
            <button onClick={stopVoiceChat} className="pdf-mic-button pdf-stop">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="4" width="16" height="16" />
              </svg>
              <span>Stop Voice Chat</span>
            </button>
            <p>Listening...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
