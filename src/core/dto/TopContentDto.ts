import { Post } from "../model/Post";
import { Preview } from "../model/Preview";

export type TopContentDto = {
    content: [
        {
            post: Post,
            preview: Preview
        }
    ]|any[]
}
