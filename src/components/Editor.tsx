"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useRef } from "react";

interface EditorProps {
  onChange: (markdown: string) => void;
  initialContent?: string;
}

export default function Editor({ onChange, initialContent }: EditorProps) {
  const editor = useCreateBlockNote();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialContent && !initialized.current) {
      initialized.current = true;
      (async () => {
        const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
        editor.replaceBlocks(editor.document, blocks);
      })();
    }
  }, [initialContent, editor]);

  return (
    <BlockNoteView
      editor={editor}
      onChange={async () => {
        const markdown = await editor.blocksToMarkdownLossy(editor.document);
        onChange(markdown);
      }}
    />
  );
}
