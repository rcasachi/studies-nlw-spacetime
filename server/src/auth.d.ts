import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: { id: number }
    user: {
      name: string
      sub: string
      avatarUrl: string
    }
  }
}
