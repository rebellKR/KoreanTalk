import { Star } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'

export default function Favorites() {
  return (
    <>
      <PageHeader title="お気に入り" subtitle="保存したフレーズと単語" />
      <EmptyState icon={Star} text="準備中です（STAGE 5）" />
    </>
  )
}
