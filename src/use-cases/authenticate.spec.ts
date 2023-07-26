import { expect, it, describe } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/prisma-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'felipe',
      email: 'dfelipebdn1@gmail.com',
      password_hash: await hash('sdfesf', 6),
    })

    const { user } = await sut.execute({
      email: 'dfelipebdn1@gmail.com',
      password: 'sdfesf',
    })
    expect(user.id).toEqual(expect.any(String))
  })
  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    expect(() =>
      sut.execute({
        email: 'dfelipebdn1@gmail.com',
        password: 'sdfesf',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)
    await usersRepository.create({
      name: 'felipe',
      email: 'dfelipebdn1@gmail.com',
      password_hash: await hash('sdfesf', 6),
    })
    expect(() =>
      sut.execute({
        email: 'dfelipebdn1@gmail.com',
        password: 'sdfesfe',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
