import { TopContentDto } from "../../dto/TopContentDto";

export interface IGetTopContentUseCase{
    execute (limit: number, offset: number): Promise<TopContentDto>
}