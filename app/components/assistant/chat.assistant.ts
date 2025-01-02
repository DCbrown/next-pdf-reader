import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { PdfContent } from "../../types/PdfContent";

export const createChatAssistant = (
  pdfContent: PdfContent
): CreateAssistantDTO => ({
  name: "PDF Reader",
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `ROLE: You are an expert at analyzing text and answering questions on it.
        -------
        TASK:
        1. The user will provide a text from a PDF. Take the personality of the character that
        would be the most fitting to be an expert on the material of the text.
        2. Answer to the user's questions based on it.
        -------
        PDF TEXT: ${pdfContent.pdfText}`,
      },
    ],
  },
  voice: {
    provider: "11labs",
    voiceId: "lffvMuaDQVN69szL6sFm",
  },
  firstMessage: `Thank you for providing the PDFs, I'm ready to answer your questions, what would you like to know?`,
});
