import { z } from "zod";

const FeedSchema = z.object({
  title: z.string().min(1, {
    message: "Title required"
  }).max(30, {
    message: "Max character for title is 30"
  }),
  description: z.string().min(1, {
    message: "Description required"
  }),
  image: z.string().nullish()
})

export { FeedSchema }