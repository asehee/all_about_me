import { Link, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Home, User, BookOpen, Menu, Code } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: User },
    { path: '/blog', label: 'Blog', icon: BookOpen },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Code className="h-6 w-6" />
          <span className="font-bold text-xl">Portfolio</span>
        </Link>

        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 transition-colors hover:text-foreground/80 ${
                  isActive(path)
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Space for future search or other elements */}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 border-b bg-background md:hidden">
            <nav className="container flex flex-col space-y-3 py-4">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'text-foreground bg-accent'
                      : 'text-foreground/60 hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </nav>
  )
}