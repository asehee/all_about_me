import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, ExternalLink, Star, GitFork, ArrowRight, Code2, Sparkles, Zap, Coffee } from 'lucide-react'

export default function Home() {
  const projects = [
    {
      title: "React Blog Platform",
      description: "A modern blog platform built with React and TypeScript, featuring full CRUD operations, user authentication, and a beautiful markdown editor.",
      tech: ["React", "TypeScript", "Tailwind CSS"],
      stars: 42,
      forks: 12,
      status: "Live",
      link: "#"
    },
    {
      title: "Node.js API Server",
      description: "Scalable REST API server with Express.js and MongoDB, implementing JWT authentication, file uploads, and real-time capabilities.",
      tech: ["Node.js", "Express", "MongoDB"],
      stars: 28,
      forks: 8,
      status: "Production",
      link: "#"
    },
    {
      title: "Vue.js Dashboard",
      description: "Interactive analytics dashboard with real-time data visualization, built using Vue 3 Composition API and Chart.js.",
      tech: ["Vue.js", "Chart.js", "Vuetify"],
      stars: 35,
      forks: 15,
      status: "Beta",
      link: "#"
    }
  ]

  const skills = [
    { name: "JavaScript", level: 95, category: "Frontend" },
    { name: "TypeScript", level: 90, category: "Frontend" },
    { name: "React", level: 95, category: "Frontend" },
    { name: "Vue.js", level: 85, category: "Frontend" },
    { name: "Node.js", level: 88, category: "Backend" },
    { name: "Python", level: 80, category: "Backend" },
    { name: "MongoDB", level: 85, category: "Database" },
    { name: "PostgreSQL", level: 82, category: "Database" }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-background py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center rounded-full border px-3 py-1 text-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Available for new opportunities
            </div>
            
            <h1 className="mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
              Full-Stack Developer
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              I craft exceptional digital experiences with modern web technologies.
              <br />
              Passionate about clean code and user-centered design.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="h-12">
                <Mail className="mr-2 h-4 w-4" />
                Get in touch
              </Button>
              <Button variant="outline" size="lg" className="h-12">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" size="lg" className="h-12">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <Code2 className="mr-1 h-3 w-3" />
              Featured Projects
            </Badge>
            <h2 className="mb-4 text-4xl font-bold tracking-tight">
              Things I've built
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A selection of projects that showcase my skills and passion for development
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Card key={index} className="group overflow-hidden transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">{project.title}</CardTitle>
                      <Badge variant="outline" className="mb-2">
                        {project.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        {project.stars}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        {project.forks}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <Coffee className="mr-1 h-3 w-3" />
              Technical Skills
            </Badge>
            <h2 className="mb-4 text-4xl font-bold tracking-tight">
              Technologies I work with
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Always learning and staying up-to-date with the latest technologies
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill, index) => (
              <Card key={index} className="text-center transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-2 text-2xl font-bold">{skill.level}%</div>
                  <div className="mb-1 font-medium">{skill.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {skill.category}
                  </Badge>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-12 text-center">
              <div className="mx-auto max-w-2xl">
                <Badge variant="secondary" className="mb-6 bg-primary-foreground/20 text-primary-foreground">
                  <Zap className="mr-1 h-3 w-3" />
                  Let's collaborate
                </Badge>
                <h2 className="mb-6 text-4xl font-bold">
                  Ready to start your next project?
                </h2>
                <p className="mb-8 text-lg opacity-90">
                  I'm always interested in new opportunities and exciting projects. 
                  Let's discuss how we can work together to bring your ideas to life.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button size="lg" variant="secondary" className="h-12">
                    <Mail className="mr-2 h-4 w-4" />
                    Start a conversation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    View my work
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}