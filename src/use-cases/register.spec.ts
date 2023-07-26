import { expect, it, describe } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/prisma-users-repository'
import { UsersAlreadyExistsError } from './erros/users-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const { user } = await sut.execute({
      name: 'Felipe',
      email: 'dfelipebdn1@gmail.com',
      password: 'sdfesf',
    })
    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const { user } = await sut.execute({
      name: 'Felipe',
      email: 'dfelipebdn1@gmail.com',
      password: 'sdfesf',
    })
    const isPasswordCorrectlyHashed = await compare(
      'sdfesf',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const email = 'dfelipebdn1d@gmail.com'

    await sut.execute({
      name: 'teste',
      email,
      password: 'sdfesf',
    })
    expect(async () => {
      await sut.execute({
        name: 'teste',
        email,
        password: 'sdfesf',
      })
    }).rejects.toBeInstanceOf(UsersAlreadyExistsError)
  })
})
