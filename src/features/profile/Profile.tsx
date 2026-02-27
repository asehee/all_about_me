import { BriefcaseBusiness } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/design/BackButton'
import PageShell from '@/components/design/PageShell'

export default function Profile() {
  const navigate = useNavigate()
  const projects = [
    {
      period: '2025',
      title: 'Personal site and journal',
      description:
        'Built and deployed a portfolio + journal flow with Cloudflare Pages/Workers and D1.',
    },
    {
      period: '2024',
      title: 'Internal product frontend',
      description:
        'Delivered UI features, stabilized edge cases, and improved release quality.',
    },
    {
      period: '2023',
      title: 'Workflow automation',
      description:
        'Reduced repetitive tasks by introducing script-based tooling in team development flow.',
    },
  ]
  const stack = ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Cloudflare', 'D1']

  return (
    <PageShell icon={BriefcaseBusiness} contentClassName="bg-black">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton label="Home" onClick={() => navigate('/')} />
        </div>

        <header>
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Work</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-7xl">
            Selected output.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/62 md:text-base">
            Representative work and the stack used to ship production-ready features.
          </p>
        </header>

        <section className="mt-14">
          <div className="space-y-1 border-t border-white/12">
            {projects.map((item, index) => (
              <article key={item.title} className="border-b border-white/12 py-5 md:py-6">
                <div className="grid gap-4 md:grid-cols-[90px_minmax(0,1fr)] md:gap-8">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/45">
                    {item.period}
                  </p>
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-2xl font-medium text-white md:text-[2rem]">
                        {item.title}
                      </h2>
                      <span className="text-xs text-white/35">0{index + 1}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/58">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h3 className="text-xs uppercase tracking-[0.18em] text-white/45">Stack</h3>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white/78"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
