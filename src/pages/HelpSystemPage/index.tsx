import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Card, Spin } from "antd";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const HelpSystemPage: React.FC = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const pdfPath = "/Manual_usuario_SantaAna2.0.pdf";

  return (
    <div className="flex justify-center items-center p-6 bg-gray-100 min-h-screen">
      <Card
        className="shadow-lg w-full max-w-4xl"
        title="📘 Sistema de Ayuda"
        variant="borderless"
        extra={
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            href={pdfPath}
            download="manual.pdf"
          >
            Descargar
          </Button>
        }
      >
        <div className="flex flex-col items-center">
          <Document
            file={pdfPath}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<Spin size="large" />}
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-md border"
            />
          </Document>

          {/* Controles de paginación */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              type="default"
              shape="circle"
              icon={<LeftOutlined />}
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            />
            <span className="text-gray-700 font-medium">
              Página {pageNumber} de {numPages}
            </span>
            <Button
              type="default"
              shape="circle"
              icon={<RightOutlined />}
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HelpSystemPage;
