import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
  onRemove: () => void;
}

const PDFViewer = ({ file, onRemove }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef<IntersectionObserver>();
  const pageElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    pageElementsRef.current = pageElementsRef.current.slice(0, numPages);
  }

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    observer.current = new IntersectionObserver((entries) => {
      const visiblePage = entries.find((entry) => entry.isIntersecting);
      if (visiblePage) {
        setPageNumber(
          Number(visiblePage.target.getAttribute("data-page-number"))
        );
      }
    }, options);

    const { current: currentObserver } = observer;

    pageElementsRef.current.forEach((page) => {
      if (page) currentObserver.observe(page);
    });

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [numPages]);

  return (
    <>
      <div className="h-[300px] md:h-full overflow-y-scroll">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="pdf-document"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div
              ref={(el) => (pageElementsRef.current[index] = el)}
              data-page-number={index + 1}
              key={index}
            >
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                className="pdf-page"
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-center rounded-3xl my-2 z-50 bg-blue-600 text-white py-1 px-4">
          {pageNumber}/{numPages}
        </div>
        <button
          onClick={onRemove}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition-colors duration-200 flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          Remove PDF
        </button>
      </div>
    </>
  );
};

export default PDFViewer;
