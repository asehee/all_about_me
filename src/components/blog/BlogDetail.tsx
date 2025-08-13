import type { BlogPost } from '../../types/blog'
import { Calendar, User, Tag, ArrowLeft, Edit, Trash2 } from 'lucide-react'

interface BlogDetailProps {
  post: BlogPost
  onBack: () => void
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
}

export default function BlogDetail({ post, onBack, onEdit, onDelete }: BlogDetailProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const renderMarkdown = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-gray-900">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-gray-900">{line.slice(4)}</h3>
        }
        if (line.startsWith('```')) {
          return <div key={index} className="my-4 p-4 bg-gray-100 rounded-lg font-mono text-sm overflow-x-auto">
            <code>{line.slice(3)}</code>
          </div>
        }
        if (line.trim() === '') {
          return <br key={index} />
        }
        
        let processedLine = line
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>')
        processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
        
        return (
          <p 
            key={index} 
            className="mb-4 leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        )
      })
  }

  const handleDelete = () => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      onDelete(post.id)
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft size={20} />
                <span>목록으로 돌아가기</span>
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(post)}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <Edit size={16} />
                  <span>수정</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 size={16} />
                  <span>삭제</span>
                </button>
              </div>
            </div>

            <article>
              <header className="mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  {post.createdAt.getTime() !== post.updatedAt.getTime() && (
                    <span className="text-sm text-gray-500">
                      (수정됨: {formatDate(post.updatedAt)})
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              <div className="prose prose-lg max-w-none">
                {renderMarkdown(post.content)}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}