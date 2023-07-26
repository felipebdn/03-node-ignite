import { expect, it, describe, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './erros/resource-not-fount-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'felipe',
      email: 'dfelipebdn1@gmail.com',
      password_hash: await hash('sdfesf', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('felipe')
  })
  it('should not be able to get user profile with wrong id', async () => {
    expect(() =>
      sut.execute({
        userId: 'non-exist-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
