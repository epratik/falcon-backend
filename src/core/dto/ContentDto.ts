import { Preview } from "../model/Preview";
import { ViewPostsDto } from "./ViewPostsDto";

export type ContentDto = {
    content: [
        {
            post: ViewPostsDto,
            preview: Preview
        }
    ]|any[]
}
