"use client";
import React from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
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
          <Document className="max-h-full" file={url}>
            <Page pageNumber={1} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
