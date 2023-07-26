import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { UsersAlreadyExistsError } from './erros/users-already-exists-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Felipe',
      email: 'dfelipebdn1@gmail.com',
      password: 'sdfesf',
    })
    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
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
