import * as z from "zod";

export const PostPatchTypeSchema = z.enum(['Like', 'Unlike', 'Deactivate']);

export const IdOnlySchema = z.object({
    postId:z.number()
}) 

export const PostPatchDtoSchema = z
    .object({
        patchType: PostPatchTypeSchema,
        requestBody: IdOnlySchema
    });

export type PostPatchDto = z.infer<typeof PostPatchDtoSchema>
export type PostPatchType = z.infer<typeof PostPatchTypeSchema>

