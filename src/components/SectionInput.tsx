// src/components/SectionInput.tsx
import React, { useRef, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Code from '@tiptap/extension-code';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isCode?: boolean;
  onSave?: () => void;
  table: boolean;
}

export default function SectionInput({ label, value, onChange, isCode, onSave, table }: Props) {
  const hasInitialized = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Code,
      Link.configure({
        openOnClick: true,
        autolink: false,
        linkOnPaste: true,
      }),
    ],
    content: value,
  });

  useEffect(() => {
    if (editor && !hasInitialized.current) {
      hasInitialized.current = true;
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const handleBlur = () => {
    if (editor) {
      const html = editor.getHTML();
      if (html !== value) {
        onChange(html);
      }
    }
  };

  const renderToolbar = () => (
    <div 
      style={{ 
        marginBottom: '0.5rem', 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-between' 
      }}>
      <div style={{ display: 'flex', flexDirection: 'row', flex: '0.5'}}>
        <button onClick={() => editor?.chain().focus().toggleBold().run()} style={{ marginRight: '0.25rem' }}>
          <strong>B</strong>
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} style={{ marginRight: '0.25rem' }}>
          <em>I</em>
        </button>
        <button onClick={() => editor?.chain().focus().toggleUnderline?.().run()} style={{ marginRight: '0.25rem' }}>
          <u>U</u>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleCode().run()}
          style={{ marginRight: '0.25rem' }}
        >
          <code>{'</>'}</code>
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) {
              editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }
          }}
        >
          🔗
        </button>
      </div>
      {!table && <button onClick={onSave} className='btn-green'>Save</button>}
    </div>
  );

  return (
    <div className="section-input">
      <h2>{label}</h2>
      {isCode ? (
        <>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
            style={{
              width: 'calc(100% - 2.1rem)',
              marginBottom: '0.5rem',
              fontFamily: 'monospace',
              backgroundColor: '#f5f5f5',
              padding: '1rem'
            }}
          />
          {onSave && <button onClick={onSave} className='btn-green'>Save</button>}
        </>
      ) : (
        <div
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            minHeight: '2rem',
            overflow: 'hidden'
          }}
          onBlur={handleBlur}
        >
          {editor && renderToolbar()}
          <EditorContent
            editor={editor}
            style={{
              outline: 'none',
              whiteSpace: 'pre-wrap'
            }}
          />
        </div>
      )}
    </div>
  );
}
