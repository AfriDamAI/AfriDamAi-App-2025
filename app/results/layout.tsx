import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scan Results | AfriDam AI',
  description: 'Your personalized melanin-rich skin analysis.',
}

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}