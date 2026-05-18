import * as z from "zod";

export const regSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is Required")
      .min(3, "Characters can't be less than 3")
      .max(40, "Characters can't be more than 40"),

    username: z
      .string()
      .nonempty("Username is Required")
      .min(5, "Username must be at least 5 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[A-Za-z0-9_]+$/,
        "Username can contain letters, numbers and underscore only",
      ),

    email: z
      .string()
      .nonempty("Email is Required")
      .email("Please enter a valid email"),

    password: z
      .string()
      .nonempty("Password is Required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number and special character",
      ),

    rePassword: z.string().nonempty("Confirm Password is Required"),

    dateOfBirth: z
      .string()
      .nonempty("Date of Birth is Required")
      .refine((date) => {
        let currentYear = new Date().getFullYear();
        let ageYear = new Date(date).getFullYear();
        let age = currentYear - ageYear;

        return age >= 18;
      }, "Age Not Allowed , Must be Above 18 "),

    gender: z.enum(["male", "female"], {
      errorMap: () => ({
        message: "Please select a valid gender",
      }),
    }),
  })

  // Confirm password validation
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is Required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .nonempty("Password is Required")
    .min(8, "Password must be at least 8 characters"),
});
