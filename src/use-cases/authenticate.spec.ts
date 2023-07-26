import { expect, it, describe, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('should be able to authenticate', async () => {
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
    expect(() =>
      sut.execute({
        email: 'dfelipebdn1@gmail.com',
        password: 'sdfesf',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
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
