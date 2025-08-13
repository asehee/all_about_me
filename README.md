# Portfolio Blog Website

A modern portfolio and blog website built with React, TypeScript, and Tailwind CSS, featuring a clean design system powered by shadcn/ui.

## ✨ Features

- **🏠 Home Page**: Modern portfolio showcase with projects and skills
- **👤 About Page**: Professional background and experience timeline
- **📝 Blog System**: Full CRUD functionality for blog posts with:
  - Create, Read, Update, Delete posts
  - Search and tag filtering
  - Markdown support
  - Local storage persistence

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm/pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cf_test
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── blog/              # Blog-specific components
│   └── Navigation.tsx     # Main navigation
├── pages/
│   ├── Home.tsx          # Portfolio homepage
│   ├── About.tsx         # About page
│   └── Blog.tsx          # Blog listing page
├── hooks/
│   └── useBlog.ts        # Blog data management
├── types/
│   └── blog.ts           # TypeScript types
└── lib/
    └── utils.ts          # Utility functions
```

## 🎨 Design System

This project uses a consistent design system based on:

- **shadcn/ui**: For base components (Button, Card, Badge, etc.)
- **CSS Variables**: For consistent theming and colors
- **Tailwind CSS**: For utility-first styling
- **Modern Layout**: Container-based responsive design

## 📝 Blog Features

- **Markdown Support**: Write posts in Markdown format
- **Tag System**: Organize posts with tags
- **Search**: Full-text search across posts
- **Responsive Design**: Works on all device sizes
- **Local Storage**: Data persists between sessions

## 🚢 Deployment

Build for production:

```bash
npm run build
# or
pnpm build
```

The `dist/` folder will contain the production-ready files.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🛠️ Development

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

Built with ❤️ using modern web technologies.
