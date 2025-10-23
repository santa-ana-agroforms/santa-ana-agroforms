// src/components/CodeFuncEditor.tsx
"use client";

import React, { useEffect, useState } from "react";

import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";

interface CodeFuncEditorProps {
  initialCode: string;
  hiddenCode?: string;
  functionName: string;
  propType: string;
  returnType?: string;
  value?: string;
  onChange?: (innerCode: string) => void;
  height?: string;
}

const CodeFuncEditor: React.FC<CodeFuncEditorProps> = ({
  initialCode,
  hiddenCode = "",
  functionName,
  propType,
  returnType = "void",
  value = "",
  onChange,
  height = "400px",
}) => {
  const [userCode, setUserCode] = useState(value);

  // Estructura del código
  const prefix = `${initialCode}\nconst ${functionName} = (props: ${propType}): ${returnType} => {\n`;
  const suffix = `\n};`;
  const fullCode = prefix + userCode + suffix;

  // Manejo de cambios dentro del cuerpo
  const handleChange = (val: string) => {
    if (!val.startsWith(prefix) || !val.endsWith(suffix)) return;
    const inner = val.slice(prefix.length, val.length - suffix.length);
    setUserCode(inner);
    onChange?.(inner);
  };

  // Bloquear edición fuera del rango permitido
  const protectedRanges = (prefixLength: number, totalLength: number) => {
    const suffixStart = totalLength - suffix.length;
    return { start: prefixLength, end: suffixStart };
  };

  // Extensión personalizada que filtra ediciones fuera de la función
  const lockOutsideExtension = EditorState.transactionFilter.of((tr) => {
    if (!tr.docChanged) return tr;
    const changes = tr.changes;
    const prefixLength = prefix.length;
    const totalLength = tr.startState.doc.length;
    const { start, end } = protectedRanges(prefixLength, totalLength);

    for (const r of changes.iterChanges()) {
      if (r.from < start || r.to > end) {
        // 🚫 Ignora cualquier cambio fuera de la función
        return [];
      }
    }
    return tr;
  });

  // Código final completo (incluye hiddenCode)
  const finalCode = hiddenCode + "\n" + prefix + userCode + suffix;

  useEffect(() => {
    // Puedes usar finalCode si necesitas ejecutar o exportar el código completo
    // console.log(finalCode);
  }, [finalCode]);

  return (
    <CodeMirror
      value={fullCode}
      height={height}
      theme="dark"
      extensions={[
        javascript({ jsx: true, typescript: true }),
        lockOutsideExtension,
        EditorView.lineWrapping,
      ]}
      onChange={(val) => handleChange(val)}
    />
  );
};

export default CodeFuncEditor;
