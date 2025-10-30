import { NextResponse } from "next/server";
import { ZodError } from "zod";

export default class Response {
  static error(error: Error | ZodError | any, status: number = 400) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.reduce<Record<string, string[]>>(
        (acc, err) => {
          const field = err.path.join(".") || "_error";
          if (!acc[field]) acc[field] = [];
          acc[field].push(err.message);
          return acc;
        },
        {}
      );
      return NextResponse.json(
        {
          error: formattedErrors,
        },
        { status }
      );
    } else if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status,
        }
      );
    } else {
      return NextResponse.json(
        {
          error: "Internal Server Error",
        },
        {
          status: 500,
        }
      );
    }
  }
}
