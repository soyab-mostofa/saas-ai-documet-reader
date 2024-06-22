"use client";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfRendererProps {
  url: string;
}
const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const { width, ref } = useResizeDetector();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = () => {
    toast({
      title: "Failed to load PDF",
      description: "Please check the URL and try again.",
      variant: "destructive",
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex w-full flex-col items-center rounded-md bg-white shadow">
      <div className="border-zinc-200-200 flex h-14 w-full items-center justify-between border-b px-2">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              value={page}
              onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
              className="h-8 w-12"
            />
            <p className="space-x-1 text-sm text-zinc-700">
              <span>/</span>
              <span>{numPages}</span>
            </p>
          </div>

          <Button
            variant="ghost"
            disabled={page === undefined || page === numPages}
            onClick={() => handlePageChange(page + 1)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-h-screen w-full flex-1">
        <div ref={ref}>
          <Document
            onLoadSuccess={onDocumentLoadSuccess}
            onError={onDocumentLoadError}
            loading={
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="animate my-24 h-6 w-6" />
              </div>
            }
            className="max-h-full"
            file={url}
          >
            <Page width={width ? width : 1} pageNumber={page} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
