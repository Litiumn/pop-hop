import { prisma } from '@/lib/prisma'
import { getUserFromServer } from '@/lib/auth-server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromServer()
    if (!user || user.role !== 'ORGANIZER') {
      return new Response('Unauthorized', { status: 401 })
    }

    const { email } = await request.json()
    if (!email) return new Response('Email is required', { status: 400 })

    const event = await prisma.event.findUnique({ where: { id: params.id } })
    if (!event || event.organizerId !== user.userId) {
      return new Response('Forbidden', { status: 403 })
    }

    const collaborator = await prisma.user.findUnique({ where: { email } })
    if (!collaborator) return new Response('User not found', { status: 404 })
    if (collaborator.role !== 'ORGANIZER') return new Response('User is not an organizer', { status: 400 })

    await prisma.event.update({
      where: { id: params.id },
      data: {
        collaborators: {
          connect: { id: collaborator.id }
        }
      }
    })

    return Response.json({ success: true })
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}
