import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBlog } from '../hooks/useBlog'
import type { BlogPost } from '../types/blog'
import BlogCard from '../components/blog/BlogCard'
import BlogForm from '../components/blog/BlogForm'
import BlogDetail from '../components/blog/BlogDetail'
import { PlusCircle, Search, BookOpen, Filter, FileText } from 'lucide-react'

type ViewMode = 'list' | 'detail' | 'create' | 'edit'

export default function Blog() {
  const { posts, loading, createPost, updatePost, deletePost } = useBlog()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  const handleCreatePost = async (postData: any) => {
    await createPost(postData)
    setViewMode('list')
  }

  const handleUpdatePost = async (postData: any) => {
    if (selectedPost) {
      await updatePost(selectedPost.id, postData)
      setViewMode('list')
      setSelectedPost(null)
    }
  }

  const handleDeletePost = async (id: string) => {
    await deletePost(id)
  }

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post)
    setViewMode('edit')
  }

  const handleViewPost = (post: BlogPost) => {
    setSelectedPost(post)
    setViewMode('detail')
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedPost(null)
  }

  if (viewMode === 'detail' && selectedPost) {
    return (
      <BlogDetail
        post={selectedPost}
        onBack={handleBackToList}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
      />
    )
  }

  if (viewMode === 'create') {
    return (
      <BlogForm
        onSubmit={handleCreatePost}
        onCancel={handleBackToList}
      />
    )
  }

  if (viewMode === 'edit' && selectedPost) {
    return (
      <BlogForm
        post={selectedPost}
        onSubmit={handleUpdatePost}
        onCancel={handleBackToList}
        isEdit
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-background py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center rounded-full border px-3 py-1 text-sm">
              <BookOpen className="mr-2 h-4 w-4" />
              Development Blog
            </div>
            
            <h1 className="mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
              Thoughts & Ideas
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Sharing experiences, learnings, and insights from my development journey
            </p>
            
            <Button size="lg" onClick={() => setViewMode('create')} className="h-12">
              <PlusCircle className="mr-2 h-4 w-4" />
              Write a post
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Search */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search posts..."
                        className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedTag('')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedTag === '' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        All Posts ({posts.length})
                      </button>
                      {allTags.map(tag => {
                        const count = posts.filter(post => post.tags.includes(tag)).length
                        return (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedTag === tag 
                                ? 'bg-primary text-primary-foreground' 
                                : 'hover:bg-muted'
                            }`}
                          >
                            {tag} ({count})
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Total Posts:</span>
                        <Badge variant="secondary">{posts.length}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Filtered Posts:</span>
                        <Badge variant="secondary">{filteredPosts.length}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tags:</span>
                        <Badge variant="secondary">{allTags.length}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">Loading posts...</p>
                </div>
              )}

              {!loading && filteredPosts.length === 0 && (
                <Card className="text-center p-12">
                  <CardContent>
                    <div className="mb-4">
                      <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {searchTerm || selectedTag ? 'No posts found' : 'No posts yet'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm || selectedTag 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'Start writing your first blog post!'}
                    </p>
                    {!searchTerm && !selectedTag && (
                      <Button onClick={() => setViewMode('create')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create your first post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {!loading && filteredPosts.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      {searchTerm || selectedTag 
                        ? `Filtered Posts (${filteredPosts.length})` 
                        : 'Recent Posts'}
                    </h2>
                    <Button variant="outline" onClick={() => setViewMode('create')}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Post
                    </Button>
                  </div>
                  
                  <div className="grid gap-6">
                    {filteredPosts.map(post => (
                      <BlogCard
                        key={post.id}
                        post={post}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                        onClick={handleViewPost}
                      />
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}