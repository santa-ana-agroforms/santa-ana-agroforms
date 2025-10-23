// src/components/TsFuncEditor.tsx
import "@/monaco/setupMonaco";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import MonacoEditor, {
  BeforeMount,
  OnMount,
  type EditorProps,
} from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface TsFuncEditorProps {
  /** Código preliminar (antes de la función) */
  initialCode: string;
  /** Código oculto (no visible pero reconocido por el compilador TS) */
  hiddenCode?: string;
  /** Nombre de la función */
  functionName: string;
  /** Tipo de los props */
  propType: string;
  /** Tipo de retorno */
  returnType?: string;
  /** Código editable dentro de la función */
  value?: string;
  /** Callback al cambiar el código del usuario */
  onChange?: (innerCode: string) => void;
  /** Altura del editor */
  height?: string;
}

export interface TsFuncEditorRef {
  getFullValue: () => string;
}

const TsFuncEditor = forwardRef<TsFuncEditorRef, TsFuncEditorProps>(
  (
    {
      initialCode,
      hiddenCode,
      functionName,
      propType,
      returnType = "void",
      value = "",
      onChange,
      height = "400px",
    },
    ref
  ) => {
    const [userCode, setUserCode] = useState(value);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    // Construcción del código visible
    const prefix = `${initialCode}\nconst ${functionName} = (props: ${propType})${returnType ? `: ${returnType}` : ""} => {\n`;
    const suffix = `\n}; \n\nexport default ${functionName};`;
    const fullCode = prefix + userCode + suffix;

    useEffect(() => setUserCode(value), [value]);

    useImperativeHandle(ref, () => ({
      getFullValue: () => fullCode,
    }));

    /** Registrar el código oculto antes de montar el editor */
    const handleBeforeMount: BeforeMount = (monaco) => {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        allowNonTsExtensions: true,
        noEmit: true,
        strict: true,
      });

      if (hiddenCode) {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          hiddenCode,
          "file:///hidden.d.ts"
        );
      }
    };

    /** Bloquea edición fuera del cuerpo de la función */
    const handleEditorMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;

      editor.onKeyDown((e) => {
        const model = editor.getModel();
        const sel = editor.getSelection();
        if (!model || !sel) return;

        const start = model.getOffsetAt(sel.getStartPosition());
        const end = model.getOffsetAt(sel.getEndPosition());
        const total = model.getValueLength();

        // Bloquear escritura fuera de los límites
        if (start < prefix.length || end > total - suffix.length) {
          e.preventDefault();
        }
      });
    };

    /** Detectar cambios solo dentro del cuerpo */
    const handleChange: EditorProps["onChange"] = (val) => {
      if (typeof val !== "string" || !editorRef.current) return;
      if (!val.startsWith(prefix) || !val.endsWith(suffix)) {
        editorRef.current.setValue(fullCode);
        return;
      }

      const inner = val.slice(prefix.length, val.length - suffix.length);
      setUserCode(inner);
      onChange?.(inner);
    };

    return (
      <MonacoEditor
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
        onChange={handleChange}
        path="file:///main.tsx"
        language="typescript"
        theme="vs-dark"
        value={fullCode}
        height={height}
        width="100%"
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 2,
          scrollBeyondLastLine: false,
        }}
      />
    );
  }
);

export default TsFuncEditor;
