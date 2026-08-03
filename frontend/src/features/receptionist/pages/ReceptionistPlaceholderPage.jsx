import { Card, PageHeader } from '../components/ui.jsx'

export default function Placeholder({ title, note }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <PageHeader eyebrow="Sabtu, 21 Juni 2026 | Welcome back, Receptionist Team" title={title} />
      <Card className="flex flex-col items-center gap-2 px-6 py-16 text-center">
        <p className="text-[15px] font-semibold text-[#191c1e]">Coming soon</p>
        <p className="max-w-md text-[13px] text-[#434655]">{note}</p>
      </Card>
    </div>
  )
}
