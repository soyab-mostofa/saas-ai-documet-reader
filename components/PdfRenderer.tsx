"use client";
import { Loader2 } from "lucide-react";
import React from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfRendererProps {
  url: string;
}
const PdfRenderer = ({ url }: PdfRendererProps) => {
  return (
    <div className="flex w-full flex-col items-center rounded-md bg-white shadow">
      <div className="border-zinc-200-200 flex h-14 w-full items-center justify-between border-b px-2">
        <div className="flex items-center gap-1.5">top bar</div>
      </div>

      <div className="max-h-screen w-full flex-1">
        <div>
          <Document
            loading={
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="animate my-24 h-6 w-6" />
              </div>
            }
            className="max-h-full"
            file={url}
          >
            <Page pageNumber={1} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
