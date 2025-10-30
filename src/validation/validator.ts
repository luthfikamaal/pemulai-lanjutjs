import { ZodType } from "zod";

export class Validator {
  static validate<T>(schema: ZodType<T>, data: T): T {
    return schema.parse(data);
  }
}
