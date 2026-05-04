import { prisma } from '@/lib/prisma'
import { getUserFromServer } from '@/lib/auth-server'

export async function GET() {
  try {
    const user = await getUserFromServer()
    if (!user || user.role !== 'ORGANIZER') {
      return new Response('Unauthorized', { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: {
        OR: [
          { organizerId: user.userId },
          { collaborators: { some: { id: user.userId } } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        applications: {
          select: {
            status: true,
            paymentStatus: true
          }
        },
        _count: {
          select: { applications: true }
        },
        collaborators: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return Response.json(events)
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}
