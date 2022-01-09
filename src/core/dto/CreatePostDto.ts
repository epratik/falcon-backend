import { container } from "tsyringe";
import * as z from "zod";
import { ListValidator } from "../CustomValidators/ListValidator";

export const CreatePostDtoSchema = z
    .object({
        tag: z.string(),
        subTag: z.string(),
        url: z.string().url(),
        urlDescription: z.string(),
        listId: z.number()
    });
    
export type CreatePostDto = z.infer<typeof CreatePostDtoSchema>;
