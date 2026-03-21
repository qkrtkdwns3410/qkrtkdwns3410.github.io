"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

interface EditorProps {
  onChange: (markdown: string) => void;
  initialContent?: string;
}

export default function Editor({ onChange, initialContent }: EditorProps) {
  const editor = useCreateBlockNote();
  const initialized = useRef(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (initialContent && !initialized.current) {
      initialized.current = true;
      (async () => {
        const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
        editor.replaceBlocks(editor.document, blocks);
      })();
    }
  }, [initialContent, editor]);

  // "|" + 스페이스로 인용문(quote) 블록 전환 (노션 스타일 단축키)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== " ") return;

      const cursor = editor.getTextCursorPosition();
      const block = cursor.block;

      if (
        block.type === "paragraph" &&
        Array.isArray(block.content) &&
        block.content.length === 1 &&
        block.content[0].type === "text" &&
        block.content[0].text === "|"
      ) {
        event.preventDefault();
        editor.updateBlock(block, {
          type: "quote" as any,
          content: [],
        });
      }
    },
    [editor]
  );

  return (
    <div onKeyDownCapture={handleKeyDown}>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={async () => {
          const markdown = await editor.blocksToMarkdownLossy(editor.document);
          onChange(markdown);
        }}
      />
    </div>
  );
}
