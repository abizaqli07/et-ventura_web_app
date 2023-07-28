import * as z from "zod"

const LoginSchema = z.object({
  email: z.string().email({
    message: "Email invalid"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 character"
  })
})

export { LoginSchema }