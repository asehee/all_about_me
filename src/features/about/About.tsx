import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/design/BackButton'
import PageShell from '@/components/design/PageShell'

export default function About() {
  const navigate = useNavigate()
  const experiences = [
    {
      period: '2024.06 - Present',
      company: 'Com2us Coporation',
      role: 'Software Developer',
    },
    {
      period: '2022.01 - 2024.06',
      company: 'CAiTORY',
      role: 'Software Developer',
    },
  ]
  const skills = ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'Cloudflare']

  return (
    <PageShell icon={User} contentClassName="bg-black">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton label="Home" onClick={() => navigate('/')} />
        </div>

        <header>
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">About</p>
          <h3 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Career
          </h3>
        </header>

        <section className="mt-14">
          <div className="relative">
            <div className="absolute bottom-2 left-3 top-2 w-px -translate-x-1/2 bg-white/12" />
            <div className="absolute bottom-2 left-3 top-2 w-px -translate-x-1/2 bg-gradient-to-b from-white/70 via-white/45 to-white/25" />

            <div className="space-y-10">
              {experiences.map((item) => (
                <article key={item.company} className="relative pl-14">
                  <span className="absolute left-3 top-3.5 z-10 h-3 w-3 -translate-x-1/2">
                    <span className="absolute inset-0 rounded-full border border-white/45 bg-black shadow-[0_0_0_3px_rgba(255,255,255,0.06)]" />
                    <span className="absolute inset-0 rounded-full border border-white/30 animate-[ping_3s_ease-out_infinite]" />
                  </span>

                  <div className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-white/45">
                          {item.period}
                        </p>
                        <h2 className="mt-2 text-2xl font-medium text-white md:text-[2rem]">
                          {item.company}
                        </h2>
                        <p className="mt-1 text-sm text-white/68">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h3 className="text-xs uppercase tracking-[0.18em] text-white/45">Skills</h3>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white/78"
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
