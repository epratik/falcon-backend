import { TopContentDto } from "../../dto/TopContentDto";

export interface IGetTopContentUseCase{
    execute(limit: number, offset: number, tag: string | undefined): Promise<TopContentDto>
}