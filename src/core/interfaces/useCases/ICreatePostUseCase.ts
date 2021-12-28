import { CreatePostDto } from "../../dto/CreatePostDto";

export interface ICreatePostUseCase{
    execute (postDto: CreatePostDto): Promise<void>
}