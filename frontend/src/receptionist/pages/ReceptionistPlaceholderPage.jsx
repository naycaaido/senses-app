import { Card, PageHeader } from '../components/ui.jsx'
import { cx } from '../utils/cx.js'
import shared from '../styles/shared.module.css'
import styles from '../styles/ReceptionistPlaceholderPage.module.css'

export default function Placeholder({ title, note }) {
  return (
    <div className={cx(shared.page, shared.narrow5xl)}>
      <PageHeader eyebrow="Sabtu, 21 Juni 2026 | Welcome back, Receptionist Team" title={title} />
      <Card className={styles.card}>
        <p className={styles.heading}>Coming soon</p>
        <p className={styles.note}>{note}</p>
      </Card>
    </div>
  )
}
