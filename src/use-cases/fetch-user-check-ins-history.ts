import { CheckInsRespository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInsHistoryUseCaseResquest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRespository: CheckInsRespository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseResquest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRespository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
