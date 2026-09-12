'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'min-h-[180px] rounded border border-cyan-500 bg-gray-800 p-3 text-cyan-200 focus:outline-none',
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    const current = editor.getHTML();
    if (value && value !== current) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!mounted) {
    return (
      <div className="mb-3 min-h-[180px] rounded border border-cyan-500 bg-gray-800 p-3 text-sm text-gray-400">
        Loading editor...
      </div>
    );
  }

  const buttonClass = 'rounded border border-cyan-700 px-2 py-1 text-xs hover:bg-cyan-900';

  return (
    <div className="mb-3">
      {editor && (
        <div className="mb-2 flex flex-wrap gap-2">
          <button
            type="button"
            className={buttonClass}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            Italic
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            List
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            Heading
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
