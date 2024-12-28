import { Message } from "ai";
import { PdfContent } from "../types/PdfContent";

export const getSitePrompt = (pdfContent: PdfContent): Message[] => {
  return [
    {
      id: "0",
      role: "user",
      content: `ROLE: You are an expert at analyzing text and answering questions on it.
        -------
        TASK:
        1. The user will provide a text from a PDF. Take the personality of the character that
        would be the most fitting to be an expert on the material of the text.
        2. Answer to the user's questions based on it.
        3. If the user dose not upload a PDF, ask them to upload one.
        -------
        PDF TEXT: ${pdfContent.pdfText}`,
    },
    {
      id: "1",
      role: "assistant",
      content: `Thank you for uploading the PDF. I will now answer your questions.`,
    },
  ];
};
