
import * as z from "zod";

export const UserPatchTypeSchema = z.enum(['Follow', 'Unfollow']);

export const FollowUnfollowSchema = z.object({
    userToFollowUnfollow:z.number()
}) 

export const UserPatchDtoSchema = z
    .object({
        patchType: UserPatchTypeSchema,
        requestBody: FollowUnfollowSchema
    });

export type UserPatchDto = z.infer<typeof UserPatchDtoSchema>
export type UserPatchType = z.infer<typeof UserPatchTypeSchema>

