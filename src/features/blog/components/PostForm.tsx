import { motion } from 'framer-motion'
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
          'is-empty before:content-[attr(data-placeholder)] before:text-white/30 before:float-left before:pointer-events-none before:h-0',
      }),
    ],
    content: initialPost?.content ?? '',
    editorProps: {
      attributes: {
        class:
          'min-h-[420px] rounded-lg border border-white/15 bg-white/[0.03] px-6 py-4 text-white focus:outline-none',
      },
    },
  })

  useEffect(() => {
    setTitle(initialPost?.title ?? '')
    setTags(initialPost?.tags ?? [])
    if (editor && initialPost) {
      editor.commands.setContent(initialPost.content ?? '', false)
    }
    if (editor && !initialPost) {
      editor.commands.setContent('', false)
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
    <motion.div
      className="min-h-screen bg-[#0a0a0a] p-8"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <Modal
        open={Boolean(validationMessage)}
        title="Validation"
        description={validationMessage ?? undefined}
        actions={
          <button
            onClick={() => setValidationMessage(null)}
            className="rounded-lg border border-white/20 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 transition-colors"
          >
            OK
          </button>
        }
      />
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-white/20 focus:outline-none"
            />
          </div>

          {/* 태그 입력 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a tag and press enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button
                onClick={handleAddTag}
                className="rounded-lg border border-white/20 px-4 py-2 text-white/85 hover:bg-white/10 transition-colors"
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
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-3 py-1 text-sm text-white/75"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white transition-colors"
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
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-white/60">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('bold')
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                Bold
              </button>
              <select
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
                className="rounded border border-white/20 bg-black/40 px-2 py-1 text-xs text-white/80"
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
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('heading', { level: 3 })
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('italic')
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('strike')
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                Strike
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHighlight().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('highlight')
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                Highlight
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('bulletList')
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                Bullet
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('orderedList')
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                Numbered
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleTaskList().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('taskList')
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                Task
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('blockquote')
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                Quote
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={`rounded border px-2.5 py-1 transition-colors ${
                  editor?.isActive('codeBlock')
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
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
                    ? 'border-white/60 text-white'
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`}
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                className="rounded border border-white/20 px-2.5 py-1 text-white/70 transition-colors hover:border-white/40"
              >
                HR
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().undo().run()}
                className="rounded border border-white/20 px-2.5 py-1 text-white/70 transition-colors hover:border-white/40"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().redo().run()}
                className="rounded border border-white/20 px-2.5 py-1 text-white/70 transition-colors hover:border-white/40"
              >
                Redo
              </button>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
