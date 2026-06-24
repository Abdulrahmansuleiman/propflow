import { Suspense } from 'react'
import NewDealForm from './NewDealForm'

export default function NewDealPage() {
  return (
    <Suspense fallback={<div className="text-gray-500 p-6">Loading...</div>}>
      <NewDealForm />
    </Suspense>
  )
}
