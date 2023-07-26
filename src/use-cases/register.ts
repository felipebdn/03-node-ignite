import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UsersAlreadyExistsError } from './erros/users-already-exists-error'
import { User } from '@prisma/client'

interface RegisterUseCaseProps {
  email: string
  name: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseProps): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UsersAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    })
    return { user }
  }
}
