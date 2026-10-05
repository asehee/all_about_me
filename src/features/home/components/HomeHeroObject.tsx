import HomeBadge from './HomeBadge'
import HomeFloppy from './HomeFloppy'

type HeroObjectVariant = 'badge' | 'floppy'

export default function HomeHeroObject({ variant = 'floppy' }: { variant?: HeroObjectVariant }) {
  return variant === 'badge' ? <HomeBadge /> : <HomeFloppy />
}
