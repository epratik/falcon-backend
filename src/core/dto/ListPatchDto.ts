import * as z from "zod";

export const ListPatchTypeSchema = z.enum(['Views']);

export const IdOnlySchema = z.object({
    listId:z.number()
}) 

export const ListPatchDtoSchema = z
    .object({
        patchType: ListPatchTypeSchema,
        requestBody: IdOnlySchema
    });

export type ListPatchDto = z.infer<typeof ListPatchDtoSchema>
export type ListPatchType = z.infer<typeof ListPatchTypeSchema>

