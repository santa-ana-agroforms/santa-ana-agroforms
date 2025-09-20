import { useState } from "react";

import { message } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import * as XLSX from "xlsx";

import { CategoryType, DataManualType } from "../components/data";

export const useExcelUpload = (
  setDataManual: React.Dispatch<React.SetStateAction<CategoryType[]>>
) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadProps = {
    multiple: false,
    fileList,
    beforeUpload: () => false, // deshabilita el upload automático
    onChange(info: { fileList: UploadFile[] }) {
      setFileList(info.fileList);

      const file = info.fileList[0]?.originFileObj;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
          });

          if (rows[0][0] !== "SantaAnaForms") {
            message.error("Archivo inválido: falta título SantaAnaForms en A1");
            return;
          }

          const headers = rows[1];
          // Validar que exista la fila de headers
          if (rows[1][0] === "") {
            message.error("Archivo inválido: faltan encabezados en la fila 2");
            return;
          }
          const dataRows = rows.slice(2);

          const parsedItems = dataRows.map((row, index) => {
            const obj: any = { key: Date.now().toString() + index };
            headers.forEach((h: string, i: number) => {
              obj[h.toLowerCase()] = row[i];
            });
            return obj as DataManualType;
          });

          setDataManual((prev) =>
            prev.map((cat) =>
              cat.key === "local" ? { ...cat, items: parsedItems } : cat
            )
          );
        };
        reader.readAsArrayBuffer(file);
      }
    },
  };

  return { uploadProps, fileList, setFileList };
};
