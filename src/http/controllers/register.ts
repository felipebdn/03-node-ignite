import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UsersAlreadyExistsError } from '@/use-cases/erros/users-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodySchema.parse(req.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      email,
      name,
      password,
    })
  } catch (err) {
    if (err instanceof UsersAlreadyExistsError) {
      res.status(409).send({ message: err.message })
    }

    throw err
  }

  res.status(201).send()
}
