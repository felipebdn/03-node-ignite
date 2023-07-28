import { FastifyReply, FastifyRequest } from 'fastify'
export async function profile(req: FastifyRequest, res: FastifyReply) {
  res.status(200).send()
}
