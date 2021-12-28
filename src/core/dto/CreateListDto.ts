import { container } from "tsyringe";
import * as z from "zod";
import { ListValidator } from "../CustomValidators/ListValidator";

export const CreateListDtoSchema = z
  .object({
    name: z.string(),
    description: z.string()
  });

export type CreateListDto = z.infer<typeof CreateListDtoSchema>;
