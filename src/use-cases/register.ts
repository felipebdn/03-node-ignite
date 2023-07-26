import { UsersAlreadyExistsError } from '@/http/controllers/erros/users-already-exists-error'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseProps {
  email: string
  name: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseProps) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UsersAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    await this.usersRepository.create({
      email,
      name,
      password_hash,
    })
  }
}
