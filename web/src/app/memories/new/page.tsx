import { NewMemory } from '@/components/NewMemory'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewMemoy() {
  return (
    <div className="flex flex-1 flex-col gap-4 py-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      <NewMemory />
    </div>
  )
}
