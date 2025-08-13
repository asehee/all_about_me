import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from '../../types/blog'
import { Calendar, User, Tag, Edit, Trash2 } from 'lucide-react'

interface BlogCardProps {
  post: BlogPost
  onEdit?: (post: BlogPost) => void
  onDelete?: (id: string) => void
  onClick?: (post: BlogPost) => void
}

export default function BlogCard({ post, onEdit, onDelete, onClick }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Card className="group cursor-pointer transition-all hover:shadow-lg" onClick={() => onClick?.(post)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {post.excerpt}
            </CardDescription>
          </div>
          
          {(onEdit || onDelete) && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(post)
                  }}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('Are you sure you want to delete this post?')) {
                      onDelete(post.id)
                    }
                  }}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          
          {post.createdAt.getTime() !== post.updatedAt.getTime() && (
            <Badge variant="outline" className="text-xs">
              Updated: {formatDate(post.updatedAt)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}