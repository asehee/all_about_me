import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/design/BackButton'
import SectionHeader from '@/components/design/SectionHeader'
import PageShell from '@/components/design/PageShell'

export default function About() {
  const navigate = useNavigate()
  const experiences = [
    {
      period: '2024.06 - Present',
      company: 'Company A',
      role: 'Frontend Developer',
      description:
        'test',
    },
    {
      period: '2022.01 - 2024.06',
      company: 'Company B',
      role: 'Product Engineer',
      description:
        'test',
    },
  ]
  const skills = ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'Cloudflare']

  return (
    <PageShell icon={User}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton label="Home" onClick={() => navigate('/')} />
        </div>

        <SectionHeader
          title="About Me"
          subtitle="Career timeline and skills."
          accentClassName="from-cyan-500 to-blue-500"
        />

        <section className="relative">
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-cyan-400/80 via-blue-400/70 to-transparent" />

          <div className="space-y-10">
            {experiences.map((item) => (
              <article key={item.company} className="grid grid-cols-[24px_minmax(0,1fr)] gap-4">
                <div className="flex justify-center pt-2">
                  <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_0_6px_rgba(34,211,238,0.15)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300/90">
                    {item.period}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{item.company}</h3>
                  <p className="mt-1 text-sm text-blue-200">{item.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
