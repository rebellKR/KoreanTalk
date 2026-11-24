import { BookOpen } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'

export default function Vocabulary() {
  return (
    <PageContainer>
      <PageHeader title="単語" subtitle="カテゴリ別の単語とカード学習" />
      <EmptyState icon={BookOpen} text="準備中です（STAGE 3）" />
    </PageContainer>
  )
}
