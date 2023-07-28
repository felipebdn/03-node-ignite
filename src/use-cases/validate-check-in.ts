import { CheckIn } from '@prisma/client'
import { CheckInsRespository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './erros/resource-not-fount-error'

interface ValidateCheckInUseCaseResquest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRespository: CheckInsRespository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseResquest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRespository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRespository.save(checkIn)

    return {
      checkIn,
    }
  }
}
