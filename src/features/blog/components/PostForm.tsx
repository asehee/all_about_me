import { ArrowLeft, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { TextStyle } from '@tiptap/extension-text-style'
import { Extension } from '@tiptap/core'
import { blogApi } from '@/services/blogApi'
import type { Post } from '@/types/blog'
import Modal from '@/components/design/Modal'

interface PostFormProps {
  mode?: 'create' | 'edit'
  initialPost?: Post | null
  defaultType?: 'blog' | 'article'
  onBack: () => void
  onSuccess: () => void
}

export default function PostForm({
  mode = 'create',
  initialPost = null,
  defaultType = 'blog',
  onBack,
  onSuccess,
}: PostFormProps) {
  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialPost?.tags ?? [])
  const [saving, setSaving] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const isEditMode = mode === 'edit' && !!initialPost
  const FontSize = Extension.create({
    name: 'fontSize',
    addGlobalAttributes() {
      return [
        {
          types: ['textStyle'],
          attributes: {
            fontSize: {
              default: null,
              parseHTML: (element) => element.style.fontSize?.replace(/["']/g, '') || null,
              renderHTML: (attributes) => {
                if (!attributes.fontSize) return {}
                return { style: `font-size: ${attributes.fontSize}` }
              },
            },
          },
        },
      ]
    },
    addCommands() {
      return {
        setFontSize:
          (fontSize: string) =>
          ({ chain }) =>
            chain().setMark('textStyle', { fontSize }).run(),
        unsetFontSize:
          () =>
          ({ chain }) =>
            chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
      }
    },
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      Link.configure({
        openOnClick: false,
      }),
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Write your content',
        emptyNodeClass:
          'is-empty before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none before:h-0',
      }),
    ],
    content: initialPost?.content ?? '',
    editorProps: {
      attributes: {
        class:
          'min-h-[420px] rounded-lg border border-border bg-muted/50 px-6 py-4 text-foreground focus:outline-none',
      },
    },
  })

  useEffect(() => {
    setTitle(initialPost?.title ?? '')
    setTags(initialPost?.tags ?? [])
    if (editor && initialPost) {
      editor.commands.setContent(initialPost.content ?? '', { emitUpdate: false })
    }
    if (editor && !initialPost) {
      editor.commands.setContent('', { emitUpdate: false })
    }
  }, [initialPost, editor])

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async () => {
    const contentText = editor?.getText().trim() ?? ''
    const contentHtml = editor?.getHTML().trim() ?? ''

    if (!title.trim() || !contentText) {
      setValidationMessage('Please enter title and content')
      return
    }

    setSaving(true)
    if (isEditMode && initialPost) {
      await blogApi.updatePost(initialPost.id, {
        title: title.trim(),
        content: contentHtml,
        tags,
      })
    } else {
      await blogApi.createPost({
        title: title.trim(),
        content: contentHtml,
        tags,
        type: defaultType,
      })
    }
    setSaving(false)
    onSuccess()
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Modal
        open={Boolean(validationMessage)}
        title="Validation"
        description={validationMessage ?? undefined}
        actions={
          <button
            onClick={() => setValidationMessage(null)}
            className="rounded-lg border border-border bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
          >
            OK
          </button>
        }
      />
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-border bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
          </button>
        </div>

        {/* 폼 */}
        <div className="space-y-6">
          {/* 제목 */}
          <div>
            <input
              type="text"
              aria-label="Post title"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="editor-title w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* 태그 입력 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                aria-label="Add tag"
                placeholder="Type a tag and press enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 rounded-lg border border-border bg-muted/50 px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={handleAddTag}
                className="rounded-lg border border-border px-4 py-2 text-foreground/80 hover:bg-accent/60 transition-colors"
              >
                Add
              </button>
            </div>

            {/* 태그 목록 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-foreground/80"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 내용 */}
          <div>
            <div className="editor-toolbar mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('bold')
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                Bold
              </button>
              <select
                aria-label="Font size"
                value={editor?.getAttributes('textStyle').fontSize ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  if (!editor) return
                  if (!value) {
                    editor.chain().focus().unsetFontSize().run()
                    return
                  }
                  editor.chain().focus().setFontSize(value).run()
                }}
                className="rounded border border-border bg-card px-2 py-1 text-xs text-foreground/80"
              >
                <option value="">Size</option>
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px">16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
                <option value="24px">24</option>
                <option value="28px">28</option>
              </select>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('heading', { level: 2 })
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('heading', { level: 3 })
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('italic')
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('strike')
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                Strike
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHighlight().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('highlight')
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                Highlight
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('bulletList')
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                Bullet
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('orderedList')
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                Numbered
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleTaskList().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('taskList')
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                Task
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('blockquote')
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                Quote
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('codeBlock')
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                Code
              </button>
              <button
                type="button"
                onClick={() => {
                  const previous = editor?.getAttributes('link').href as string | undefined
                  const url = window.prompt('Enter URL', previous ?? '')
                  if (!editor) return
                  if (url === null) return
                  if (url.trim() === '') {
                    editor.chain().focus().unsetLink().run()
                    return
                  }
                  editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
                }}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('link')
                    ? 'border-primary/40 bg-accent text-primary'
                    : 'border-border text-foreground/80 hover:border-primary/50'
                }`}
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                className="rounded border border-border px-2.5 py-1 text-foreground/80 transition-colors hover:border-primary/50"
              >
                HR
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().undo().run()}
                className="rounded border border-border px-2.5 py-1 text-foreground/80 transition-colors hover:border-primary/50"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().redo().run()}
                className="rounded border border-border px-2.5 py-1 text-foreground/80 transition-colors hover:border-primary/50"
              >
                Redo
              </button>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  )
}
