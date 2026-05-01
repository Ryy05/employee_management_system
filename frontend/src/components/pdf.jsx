import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfPreview({ url }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }


  return (
    <Document file={url} onLoadError={(error) => console.error(error)}>
      <Page pageNumber={1} />
    </Document>
  );
};


