import { useSiteSettings, useSections } from '../hooks/useFirestore'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import CategoryRow from '../components/CategoryRow'
import Footer from '../components/Footer'
import SectionBlock from '../components/SectionBlock'

export default function Home() {
  const { settings } = useSiteSettings()
  const { sections, loading } = useSections()

  return (
    <div className="min-h-screen bg-white">
      <TopBar settings={settings} />
      <Navbar settings={settings} sections={sections} />
      <Hero settings={settings} />
      <CategoryRow sections={sections} />
      {loading ? (
        <p className="py-20 text-center text-slate-400">Loading...</p>
      ) : sections.length === 0 ? (
        <p className="py-20 text-center text-slate-400">Site is being set up. Check back soon.</p>
      ) : (
        sections.map((s) => <SectionBlock key={s.id} section={s} />)
      )}
      <Footer settings={settings} />
    </div>
  )
}