import { CheckIn } from '@prisma/client'
import { CheckInsRespository } from '@/repositories/check-ins-repository'

interface CheckInUseCaseResquest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRespository: CheckInsRespository) {}

  async execute({
    gymId,
    userId,
  }: CheckInUseCaseResquest): Promise<CheckInUseCaseResponse> {
    const checkIn = await this.checkInsRespository.create({
      gym_id: gymId,
      user_id: userId,
    })
    return {
      checkIn,
    }
  }
}
