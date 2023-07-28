import { CheckInsRespository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUseCaseResquest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRespository: CheckInsRespository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseResquest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRespository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
