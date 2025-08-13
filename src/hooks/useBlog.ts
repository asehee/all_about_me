import { useState, useEffect } from 'react'
import type { BlogPost, CreateBlogPost, UpdateBlogPost } from '../types/blog'

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts')
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        }))
        setPosts(parsedPosts)
      } catch (error) {
        console.error('Failed to parse saved posts:', error)
      }
    } else {
      const samplePosts: BlogPost[] = [
        {
          id: '1',
          title: 'React와 TypeScript로 시작하는 웹 개발',
          content: `# React와 TypeScript로 시작하는 웹 개발

React는 현재 가장 인기 있는 프론트엔드 라이브러리 중 하나입니다. TypeScript와 함께 사용하면 더욱 안전하고 유지보수하기 쉬운 코드를 작성할 수 있습니다.

## 왜 TypeScript를 사용해야 할까요?

1. **타입 안전성**: 컴파일 시점에 오류를 발견할 수 있습니다.
2. **개발자 경험**: IDE의 자동완성과 리팩토링 지원이 향상됩니다.
3. **코드 가독성**: 타입 정의를 통해 코드의 의도를 명확히 할 수 있습니다.

## 시작하기

새로운 React + TypeScript 프로젝트를 시작하려면 다음 명령어를 사용하세요:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

이것으로 기본적인 설정이 완료됩니다!`,
          excerpt: 'React와 TypeScript를 함께 사용하여 안전하고 유지보수하기 쉬운 웹 애플리케이션을 개발하는 방법을 알아봅시다.',
          author: '개발자',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          tags: ['React', 'TypeScript', '웹개발'],
        },
        {
          id: '2',
          title: 'Node.js로 RESTful API 구축하기',
          content: `# Node.js로 RESTful API 구축하기

Node.js는 서버사이드 JavaScript 런타임으로, RESTful API를 구축하는 데 매우 적합한 플랫폼입니다.

## Express.js 설정

Express.js는 Node.js를 위한 웹 애플리케이션 프레임워크입니다:

\`\`\`javascript
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});
\`\`\`

## REST API 설계 원칙

1. **자원 중심의 URL 설계**
2. **HTTP 메서드 활용** (GET, POST, PUT, DELETE)
3. **상태 코드 적절한 사용**
4. **일관된 응답 형식**`,
          excerpt: 'Node.js와 Express.js를 사용하여 효율적이고 확장 가능한 RESTful API를 구축하는 방법을 알아봅시다.',
          author: '개발자',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
          tags: ['Node.js', 'Express', 'API', '백엔드'],
        },
      ]
      setPosts(samplePosts)
      localStorage.setItem('blogPosts', JSON.stringify(samplePosts))
    }
  }, [])

  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts)
    localStorage.setItem('blogPosts', JSON.stringify(newPosts))
  }

  const createPost = async (postData: CreateBlogPost): Promise<BlogPost> => {
    setLoading(true)
    try {
      const newPost: BlogPost = {
        ...postData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const newPosts = [newPost, ...posts]
      savePosts(newPosts)
      return newPost
    } finally {
      setLoading(false)
    }
  }

  const updatePost = async (id: string, updates: UpdateBlogPost): Promise<BlogPost | null> => {
    setLoading(true)
    try {
      const postIndex = posts.findIndex(post => post.id === id)
      if (postIndex === -1) return null

      const updatedPost: BlogPost = {
        ...posts[postIndex],
        ...updates,
        updatedAt: new Date(),
      }

      const newPosts = [...posts]
      newPosts[postIndex] = updatedPost
      savePosts(newPosts)
      return updatedPost
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string): Promise<boolean> => {
    setLoading(true)
    try {
      const newPosts = posts.filter(post => post.id !== id)
      savePosts(newPosts)
      return true
    } finally {
      setLoading(false)
    }
  }

  const getPost = (id: string): BlogPost | undefined => {
    return posts.find(post => post.id === id)
  }

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    getPost,
  }
}