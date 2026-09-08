import { useState } from 'react'
import { ChevronDown, ExternalLink, LifeBuoy, Mail } from 'lucide-react'
import { Card, PanelHeader } from '../ui'

const GUIDES: { q: string; a: string }[] = [
  {
    q: 'How do I put my shop pictures on the page?',
    a: 'Open Sections and create a section — call it whatever fits, like Shoes or In the shop. Open it, press "Add item", give the item a name, then drag your pictures or videos into the upload box. Press "Add item" to finish. It appears on the page straight away.',
  },
  {
    q: 'Can I post a video?',
    a: 'Yes. Anywhere you can add a picture you can also add a video. On the page it plays quietly in the card, and visitors can tap it to watch it full size with sound.',
  },
  {
    q: 'Why is a section not showing on the site?',
    a: 'Either it is hidden — press the eye button on the section to show it again — or the items inside it are hidden. A section with no items still shows, with a "nothing here yet" note.',
  },
  {
    q: 'Nothing is set up. Is that a mistake?',
    a: 'No. The site starts completely blank on purpose, so nothing fake is ever shown to your customers. Any part you leave empty simply does not appear on the page.',
  },
  {
    q: 'How do I change the big picture at the top?',
    a: 'Go to Top banner. Add a picture or video, write a title, and add button text if you want buttons. Press "Save changes" at the bottom.',
  },
  {
    q: 'Do I have to press save?',
    a: 'On Brand, Top banner and About & contact, yes — a bar appears at the bottom when something changed. Sections, items and highlights save the moment you press their own button.',
  },
  {
    q: 'Someone else needs to post pictures too.',
    a: 'Open Team, add their Google email, and tell them to sign in at /admin with that Google account. Remove them from the same screen whenever you like.',
  },
  {
    q: 'I changed something and it looks wrong.',
    a: 'Press "Undo" in the save bar before saving to go back. If it is already saved, just type over it again — every field can be cleared, and an empty field hides that part of the page.',
  },
]

export default function HelpPanel() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <PanelHeader title="Help" description="Short answers to the questions that come up most." />

      <div className="mb-5 flex items-start gap-4 rounded-2xl bg-ink-950 p-5 text-white">
        <span className="mt-0.5 text-sand-400"><LifeBuoy size={22} /></span>
        <div>
          <p className="font-semibold">Stuck on something?</p>
          <p className="mt-1 text-sm text-ink-400">
            Nothing here can break the shop permanently — anything you delete can be added again.
            If you are still stuck, send a message and describe what you were trying to do.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="mailto:support@example.com?subject=Help%20with%20my%20shop%20site"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink-900 transition hover:bg-ink-50"
            >
              <Mail size={15} /> Email support
            </a>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
            >
              <ExternalLink size={15} /> Open my site
            </a>
          </div>
        </div>
      </div>

      <Card title="Common questions">
        <ul className="divide-y divide-ink-100">
          {GUIDES.map((g, i) => (
            <li key={g.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
              >
                <span className="text-sm font-medium text-ink-800">{g.q}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-ink-400 transition ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && <p className="pb-4 text-sm leading-relaxed text-ink-600">{g.a}</p>}
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
