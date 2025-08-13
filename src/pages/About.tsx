import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Briefcase, GraduationCap, Award, Heart, User, Code, Trophy, BookOpen, Mail } from 'lucide-react'

export default function About() {
  const experiences = [
    {
      year: '2024',
      title: 'Senior Full-Stack Developer',
      company: 'Tech Startup',
      description: 'Leading microservices architecture design and team management',
      current: true
    },
    {
      year: '2022',
      title: 'Full-Stack Developer',
      company: 'IT Consulting Company',
      description: 'Web application development and cloud deployment',
      current: false
    },
    {
      year: '2021',
      title: 'Junior Developer',
      company: 'Software Company',
      description: 'Frontend development and user experience improvement',
      current: false
    },
  ]

  const achievements = [
    {
      icon: Award,
      title: 'AWS Certified Developer',
      description: 'Amazon Web Services developer certification',
      date: '2023',
      category: 'Certification'
    },
    {
      icon: Trophy,
      title: 'Hackathon Winner',
      description: 'First prize at regional developer hackathon',
      date: '2022',
      category: 'Competition'
    },
    {
      icon: Code,
      title: 'Open Source Contributor',
      description: '100+ commits to major open source projects',
      date: '2021-2024',
      category: 'Community'
    },
    {
      icon: BookOpen,
      title: 'Technical Blog',
      description: '100k+ monthly views technical blog',
      date: '2020-Present',
      category: 'Content'
    },
  ]

  const skills = [
    { category: 'Frontend', skills: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS'] },
    { category: 'Backend', skills: ['Node.js', 'Python', 'Express', 'FastAPI'] },
    { category: 'Database', skills: ['MongoDB', 'PostgreSQL', 'Redis', 'Prisma'] },
    { category: 'DevOps', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-background py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center rounded-full border px-3 py-1 text-sm">
              <User className="mr-2 h-4 w-4" />
              About Me
            </div>
            
            <h1 className="mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
              Developer Story
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Passionate about creating exceptional digital experiences
              <br />
              and solving complex problems with elegant solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Basic Info Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <MapPin className="mr-1 h-3 w-3" />
              Basic Information
            </Badge>
            <h2 className="mb-4 text-4xl font-bold tracking-tight">
              Get to know me
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A quick overview of my background and expertise
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="mx-auto mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Location</h3>
                <p className="text-muted-foreground">Seoul, South Korea</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Calendar className="mx-auto mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Experience</h3>
                <p className="text-muted-foreground">3+ Years</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Briefcase className="mx-auto mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Role</h3>
                <p className="text-muted-foreground">Full-Stack Developer</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <GraduationCap className="mx-auto mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Education</h3>
                <p className="text-muted-foreground">Computer Science</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <Code className="mr-1 h-3 w-3" />
              Technical Skills
            </Badge>
            <h2 className="mb-4 text-4xl font-bold tracking-tight">
              What I work with
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {skills.map((skillGroup, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{skillGroup.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <Briefcase className="mr-1 h-3 w-3" />
              Career Journey
            </Badge>
            <h2 className="mb-4 text-4xl font-bold tracking-tight">
              Professional experience
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              My development journey and key milestones
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <Card key={index} className={`relative ${exp.current ? 'border-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="mb-2">{exp.title}</CardTitle>
                        <CardDescription className="text-base font-medium text-primary">
                          {exp.company}
                        </CardDescription>
                        {exp.current && (
                          <Badge className="mt-2">Current Position</Badge>
                        )}
                      </div>
                      <Badge variant="outline">{exp.year}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <Trophy className="mr-1 h-3 w-3" />
              Achievements
            </Badge>
            <h2 className="mb-4 text-4xl font-bold tracking-tight">
              Recognition & Awards
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Milestones and accomplishments in my development career
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <achievement.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {achievement.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{achievement.description}</p>
                      <p className="text-sm font-medium text-primary">{achievement.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Passion Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-12 text-center">
              <div className="mx-auto max-w-2xl">
                <Heart className="mx-auto mb-6 h-12 w-12" />
                <h2 className="mb-6 text-4xl font-bold">
                  Passion for Development
                </h2>
                <p className="mb-8 text-lg opacity-90 leading-relaxed">
                  I believe in creating software that not only solves problems but also 
                  provides real value to users. I love learning new technologies, 
                  collaborating with teams, and continuously improving both code quality 
                  and user experience.
                </p>
                <Button size="lg" variant="secondary" className="h-12">
                  <Mail className="mr-2 h-4 w-4" />
                  Let's work together
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}