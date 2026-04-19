import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const events = await prisma.event.findMany()

    return Response.json(events)
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}