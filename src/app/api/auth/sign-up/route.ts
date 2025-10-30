import prisma from "@/lib/prisma";
import Response from "@/response/response";
import { AuthValidation } from "@/validation/auth.validation";
import { Validator } from "@/validation/validator";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import bcrypt from "bcrypt";

type SignUpRequest = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export const POST = async (req: NextRequest) => {
  try {
    const body: SignUpRequest = await req.json();
    const isRegistered = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (isRegistered) {
      throw new ZodError([
        {
          message: "Email already registered",
          path: ["email"],
          code: "custom",
        },
      ]);
    }

    const validatedData = Validator.validate(
      AuthValidation.REGISTER,
      body
    ) as SignUpRequest;
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });
    return NextResponse.json(
      {
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.error(error);
  }
};
