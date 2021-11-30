import { Preview } from "../model/Preview";
import { TopPostsDto } from "./TopPostsDto";

export type TopContentDto = {
    content: [
        {
            post: TopPostsDto,
            preview: Preview
        }
    ]|any[]
}
