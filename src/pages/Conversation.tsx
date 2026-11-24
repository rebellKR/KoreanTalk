import { MessagesSquare } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'

export default function Conversation() {
  return (
    <PageContainer>
      <PageHeader title="会話" subtitle="シーン別のフレーズ" />
      <EmptyState icon={MessagesSquare} text="準備中です（STAGE 4）" />
    </PageContainer>
  )
}
