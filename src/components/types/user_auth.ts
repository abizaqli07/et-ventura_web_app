import * as z from "zod"

const LoginSchema = z.object({
  email: z.string().email({
    message: "Email invalid"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 character"
  })
})

const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email invalid"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 character"
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 character"
  }),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password != confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Password doesnt match",
      path: ['confirmPassword']
    })
  }
})

const RegisterProfileSchema = z.object({
  username: z.string().max(16, {
    message: "Username max character is 16"
  }),
  name: z.string(),
  phone: z.string().max(15, {
    message: "Phone number max character is 15"
  }),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  biography: z.string(),
  interest: z.string(),
  skills: z.string(),
  userId: z.string().cuid()
})

export { LoginSchema, RegisterSchema, RegisterProfileSchema }