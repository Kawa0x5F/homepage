'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { FC, useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3,
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Code,
  Quote,
  Undo,
  Redo,
  Maximize,
  Minimize,
  FileDown
} from 'lucide-react';
import { Markdown } from 'tiptap-markdown';

interface RichTextEditorProps {
  content?: string;
  initialContent?: string;
  setContent: (content: string) => void;
  isMarkdown?: boolean;
}

interface ToolbarButtonProps {
  action: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title?: string;
}

const ToolbarButton: FC<ToolbarButtonProps> = ({ action, isActive, children, title }) => (
  <button
    onClick={action}
    className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 transition-colors
      ${isActive 
        ? 'bg-gray-100 text-gray-900' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
    title={title}
  >
    {children}
  </button>
);

const ModernRichTextEditor: FC<RichTextEditorProps> = ({ 
  content, 
  initialContent = '', 
  setContent, 
  isMarkdown = true,
}) => {
  const [editorContent, setEditorContent] = useState(content || initialContent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!editorContent || editorContent === '<p></p>');
  const [isFocused, setIsFocused] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const customImageUploadButton = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (editor && e.target?.result) {
          editor.chain().focus().setImage({ src: e.target.result as string }).run();
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Markdown.configure({
        html: false,
        tightLists: true,
        bulletListMarker: '-',
        linkify: true,
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      
      if (isMarkdown) {
        try {
          const markdown = editor.storage.markdown.getMarkdown();
          setMarkdownContent(markdown);
          setContent(markdown);
        } catch (err) {
          console.error("Markdown変換エラー:", err);
          setContent(html);
        }
      } else {
        setContent(html);
      }
      setIsEmpty(editor.isEmpty);
    },
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
    },
  });

  if (!editor) return null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const downloadMarkdown = () => {
    if (!markdownContent && !editor) return;
    
    const markdown = markdownContent || editor.storage.markdown.getMarkdown();
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // エディタスタイルのカスタム定義
  const customStyles = `
    .ProseMirror {
      outline: none;
      min-height: 100%;
      height: 100%;
    }
    
    .editor-container {
      position: relative;
      transition: all 0.2s ease;
    }
    
    .editor-content {
      min-height: 400px;
      transition: all 0.2s ease;
    }
    
    .editor-content::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: -1;
      transition: opacity 0.2s ease;
    }
    
    .editor-content.empty:not(.focused)::before {
      background: radial-gradient(circle at center, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0) 70%);
      opacity: 1;
    }

    .placeholder-message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #9ca3af;
      text-align: center;
      pointer-events: none;
      width: 80%;
    }

    .ProseMirror ul {
      list-style-type: disc;
      padding-left: 1.5em;
      margin: 1em 0;
    }
    
    .ProseMirror ol {
      list-style-type: decimal;
      padding-left: 1.5em;
      margin: 1em 0;
    }
    
    .ProseMirror blockquote {
      border-left: 3px solid #e9ecef;
      padding-left: 1em;
      margin-left: 0;
      margin-right: 0;
      font-style: italic;
      color: #495057;
      background-color: #f8f9fa;
      padding: 0.5em 1em;
      border-radius: 0.25em;
    }
    
    .ProseMirror pre {
      background-color: #f8f9fa;
      padding: 0.75em 1em;
      border-radius: 0.25em;
      overflow-x: auto;
      margin: 1em 0;
    }
    
    .ProseMirror code {
      background-color: #f8f9fa;
      padding: 0.2em 0.4em;
      border-radius: 0.25em;
      font-size: 0.9em;
    }
    
    .ProseMirror h1 {
      font-size: 1.75em;
      margin-top: 1.5em;
      margin-bottom: 0.75em;
      font-weight: 600;
    }
    
    .ProseMirror h2 {
      font-size: 1.5em;
      margin-top: 1.25em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    
    .ProseMirror h3 {
      font-size: 1.25em;
      margin-top: 1em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
  `;

  return (
    <div 
      className={`
        bg-white transition-all rounded-lg
        ${isFullscreen ? 'fixed inset-0 z-50' : ''}
      `}
    >
      <style>{customStyles}</style>
      
      {/* ツールバー */}
      <div className="flex items-center p-3 bg-white border-b border-gray-100 flex-wrap gap-y-2 sticky top-0 z-10">
        <div className="flex items-center">
          <ToolbarButton
            action={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="太字"
          >
            <Bold size={16} />
          </ToolbarButton>

          <ToolbarButton
            action={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="イタリック"
          >
            <Italic size={16} />
          </ToolbarButton>

          <div className="mx-2 h-4 w-px bg-gray-100"></div>

          <ToolbarButton
            action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="見出し1"
          >
            <Heading1 size={16} />
          </ToolbarButton>

          <ToolbarButton
            action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="見出し2"
          >
            <Heading2 size={16} />
          </ToolbarButton>

          <ToolbarButton
            action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="見出し3"
          >
            <Heading3 size={16} />
          </ToolbarButton>

          <div className="mx-2 h-4 w-px bg-gray-100"></div>
          
          <ToolbarButton
            action={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="箇条書き"
          >
            <List size={16} />
          </ToolbarButton>

          <ToolbarButton
            action={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="番号付きリスト"
          >
            <ListOrdered size={16} />
          </ToolbarButton>

          <div className="mx-2 h-4 w-px bg-gray-100"></div>
          
          <ToolbarButton
            action={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="引用"
          >
            <Quote size={16} />
          </ToolbarButton>

          <ToolbarButton
            action={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="コードブロック"
          >
            <Code size={16} />
          </ToolbarButton>

          <div className="mx-2 h-4 w-px bg-gray-100"></div>
          
          <ToolbarButton
            action={() => {
              const url = prompt('リンクのURLを入力');
              if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }}
            isActive={editor.isActive('link')}
            title="リンク"
          >
            <LinkIcon size={16} />
          </ToolbarButton>

          <ToolbarButton
            action={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = async (event) => {
                const target = event.target as HTMLInputElement;
                if (!target.files || target.files.length === 0) return;
                
                const file = target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                  if (e.target?.result) {
                    editor.chain().focus().setImage({ src: e.target.result as string }).run();
                  }
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }}
            title="画像"
          >
            <ImageIcon size={16} />
          </ToolbarButton>

          <div className="mx-2 h-4 w-px bg-gray-100"></div>

          <ToolbarButton
            action={() => editor.chain().focus().undo().run()}
            title="元に戻す"
          >
            <Undo size={16} />
          </ToolbarButton>

          <ToolbarButton
            action={() => editor.chain().focus().redo().run()}
            title="やり直す"
          >
            <Redo size={16} />
          </ToolbarButton>
        </div>

        <div className="ml-auto flex items-center">
          {isMarkdown && (
            <ToolbarButton
              action={downloadMarkdown}
              title="Markdownをダウンロード"
            >
              <FileDown size={16} />
            </ToolbarButton>
          )}
          
          <ToolbarButton
            action={toggleFullscreen}
            title={isFullscreen ? "フルスクリーン解除" : "フルスクリーン"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </ToolbarButton>
        </div>
      </div>

      {/* エディタ本体 */}
      <div className={`editor-container relative transition-all duration-200 hover:bg-gray-50/20`}>
        {isEmpty && !isFocused && (
          <div className="placeholder-message">
            <p className="text-lg font-medium">記事を書いてみましょう</p>
            <p className="text-sm mt-2">クリックして入力を開始してください</p>
          </div>
        )}
        
        <EditorContent 
          editor={editor} 
          className={`
            editor-content relative
            prose max-w-none transition-all
            ${isFullscreen ? 'p-12 mx-auto max-w-4xl min-h-screen' : 'p-8 min-h-[400px]'}
            ${isEmpty ? 'empty' : ''}
            ${isFocused ? 'focused' : ''}
          `}
        />
      </div>
    </div>
  );
};

export default ModernRichTextEditor;