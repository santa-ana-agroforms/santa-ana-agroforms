import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import TsFuncEditor, { TsFuncEditorRef } from "@/components/CodeFuncEditor";

import { ElementItem } from "..";

interface TsEditorCodeProps {
  fieldsList?: ElementItem[];
  // Nuevas props para manejar el valor
  value?: string;
  onChange?: (value: string) => void;
}

export interface TsEditorCodeRef {
  getValue: () => string;
  getFullCode: () => string;
  getPropsList: () => string[];
}

const TsEditorCode = forwardRef<TsEditorCodeRef, TsEditorCodeProps>(
  ({ fieldsList = [], value = "", onChange }, ref) => {
    const [inner, setInner] = useState("");
    const tsFuncEditorRef = useRef<TsFuncEditorRef>(null);

    // console.warn("fields: ", fieldsList);

    // Función para extraer los nombres de las props de la interfaz
    const extractPropsFromInterface = (code: string): string[] => {
      try {
        // Buscar la interfaz Props en el código
        const interfaceMatch = code.match(/interface Props\s*{([^}]*)}/);
        if (!interfaceMatch) return [];

        const interfaceBody = interfaceMatch[1];

        // Extraer nombres de propiedades (líneas que terminan con ;)
        const propLines = interfaceBody
          .split("\n")
          .map((line) => line.trim())
          .filter(
            (line) => line && !line.startsWith("//") && line.endsWith(";")
          );

        // Extraer solo los nombres (antes de los :)
        const propNames = propLines
          .map((line) => {
            const propMatch = line.match(/^(\w+)\s*:/);
            return propMatch ? propMatch[1] : null;
          })
          .filter(Boolean) as string[];

        return propNames;
      } catch (error) {
        console.error("Error extrayendo props:", error);
        return [];
      }
    };

    // Exponer métodos al componente padre
    useImperativeHandle(ref, () => ({
      getValue: () => inner,
      getFullCode: () => {
        if (tsFuncEditorRef.current) {
          return tsFuncEditorRef.current.getFullValue();
        }
        return generateFullCode(inner);
      },
      getPropsList: () => {
        const fullCode =
          tsFuncEditorRef.current?.getFullValue() || generateFullCode(inner);
        return extractPropsFromInterface(fullCode);
      },
    }));

    const generateFullCode = (innerCode: string = inner) => {
      const prefix = `${initialCode}\nconst ${functionName} = (props: ${propType})${returnType ? `: ${returnType}` : ""} => {\n`;
      const suffix = `\n}; \n\nexport default ${functionName};`;
      return prefix + innerCode + suffix;
    };

    const functionName = "calculateTheme";
    const propType = "Props";
    const returnType = "string";

    const handleChange = (newValue: string) => {
      setInner(newValue);
      onChange?.(newValue);
    };

    // Función para mapear tipos de field a tipos TypeScript
    const mapFieldTypeToTS = (fieldType: string): string => {
      const typeMap: Record<string, string> = {
        text: "string",
        texto: "string",
        number: "number",
        numero: "number",
        boolean: "boolean",
        date: "Date",
        email: "string",
        password: "string",
        tel: "string",
        url: "string",
        color: "string",
      };

      return typeMap[fieldType] || "any";
    };

    // Generar la interfaz Props dinámicamente basada en fieldsList
    const generatePropsInterface = (fields: ElementItem[]): string => {
      if (fields.length === 0) {
        return `interface Props {
  ventas_grupo: {
    producto: string;
    precio: money_number_type;
  }[];
}`;
      }

      const propsContent = fields
        .map((field) => {
          const tsType = mapFieldTypeToTS(field.type);
          return `  ${field.values?.nombre}: ${tsType};`;
        })
        .join("\n");

      return `interface Props {
${propsContent}
}`;
    };

    const initialCode = `
// tu setup previo (tipos, imports, etc.)

${generatePropsInterface(fieldsList)};
`;

    const hiddenCode = `
interface User {
  id: number;
  name: string;
}

declare function sum(a: number, b: number): Promise<User>;
`;

    return (
      <div className="flex flex-col">
        <TsFuncEditor
          ref={tsFuncEditorRef}
          initialCode={initialCode}
          hiddenCode={hiddenCode}
          functionName="calculateTheme"
          propType="Props"
          returnType="string"
          value={inner}
          onChange={setInner}
          height="300px"
          //fieldsList={fieldsList}
        />

        <pre className="mt-4 bg-black text-green-400 p-2 rounded">{inner}</pre>
      </div>
    );
  }
);

TsEditorCode.displayName = "TsEditorCode";

export default TsEditorCode;
