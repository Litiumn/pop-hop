export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' }
    })

    return Response.json(events)
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}