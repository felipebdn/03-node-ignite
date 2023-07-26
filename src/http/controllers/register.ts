import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersAlreadyExistsError } from './erros/users-already-exists-error'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodySchema.parse(req.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    registerUseCase.execute({
      email,
      name,
      password,
    })
  } catch (error) {
    if (error instanceof UsersAlreadyExistsError) {
      res.status(409).send({ message: error.message })
    }
    res.status(500).send()
  }

  res.status(201).send()
}
