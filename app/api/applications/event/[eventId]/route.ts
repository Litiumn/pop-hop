import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const url = new URL(req.url)

  const page = Number(url.searchParams.get('page') || 1)
  const limit = 5

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { eventId },
      include: {
        user: {
          include: {
            vendorProfile: true
          }
        }
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.application.count({
      where: { eventId }
    })
  ])

  return Response.json({
    data: applications,
    total,
    hasMore: page * limit < total
  })
}
