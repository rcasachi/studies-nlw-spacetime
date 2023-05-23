import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { client } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {
    // await request.jwtVerify()
    const memories = await client.memory.findMany({
      where: { userId: request.user.sub },
      orderBy: { createdAt: 'asc' },
    })
    return memories.map((memory) => ({
      id: memory.id,
      coverUrl: memory.coverUrl,
      createdAt: memory.createdAt,
      excerpt: memory.content.substring(0, 115).concat('...'),
    }))
  })

  app.get('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() })
    const { id } = paramsSchema.parse(request.params)

    const memory = await client.memory.findUniqueOrThrow({ where: { id } })

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return memory
  })

  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)
    const memory = await client.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: '123',
      },
    })
    return memory
  })

  app.put('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() })
    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })
    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)

    let memory = await client.memory.findUniqueOrThrow({ where: { id } })
    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    memory = await client.memory.update({
      where: { id },
      data: { content, isPublic, coverUrl },
    })
    return memory
  })

  app.delete('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() })
    const { id } = paramsSchema.parse(request.params)

    const memory = await client.memory.findUniqueOrThrow({ where: { id } })
    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await client.memory.delete({ where: { id } })
  })
}
