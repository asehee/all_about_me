import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/design/BackButton'
import PageShell from '@/components/design/PageShell'

export default function Etc() {
  const navigate = useNavigate()
  const labEntries = [
    {
      title: 'GitHub repo 분석',
      description: 'URL을 입력하면 서버가 컨텍스트를 수집하고 LLM이 리포트를 만들어 줍니다.',
      link: '/etc/github',
    },
  ]

  return (
    <PageShell icon={Sparkles} contentClassName="bg-black">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton label="Home" onClick={() => navigate('/')} />
        </div>

        <header>
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Tools</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-7xl">
            Useful developer utilities.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/62 md:text-base">
            Handy tools and helpers for various tasks.
          </p>
        </header>

        <section className="mt-14">
          <div className="space-y-1 border-t border-white/12">
            {labEntries.map((item, index) => {
              const content = (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-medium text-white md:text-[2rem]">
                      {item.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/58">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs text-white/35">0{index + 1}</span>
                </div>
              )
              return (
                <article key={item.title} className="border-b border-white/12 py-5 md:py-6">
                  {item.link ? (
                    <a href={item.link}>{content}</a>
                  ) : (
                    content
                  )}
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
