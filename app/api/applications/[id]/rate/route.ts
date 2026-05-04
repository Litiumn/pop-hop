import { prisma } from '@/lib/prisma'
import { getUserFromServer } from '@/lib/auth-server'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromServer()
    if (!user || user.role !== 'ORGANIZER') {
      return new Response('Unauthorized', { status: 401 })
    }

    const { rating, feedback } = await request.json()
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return new Response('Invalid rating', { status: 400 })
    }

    const { id } = await params

    // Ensure the user is the organizer of the event this application belongs to
    const application = await prisma.application.findUnique({
      where: { id },
      include: { event: true }
    })

    if (!application || application.event.organizerId !== user.userId) {
      return new Response('Forbidden', { status: 403 })
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { organizerRating: rating, organizerFeedback: feedback }
    })

    return Response.json(updated)
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}
