import { useSession } from "next-auth/react"
import { api } from "~/utils/api";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input";
import { FeedSchema } from "~/components/types/entrepreneur_feed";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "../ui/textarea";


const NewFeedForm = () => {
  const session = useSession()

  const form = useForm<z.infer<typeof FeedSchema>>({
    resolver: zodResolver(FeedSchema),
    defaultValues: {
      title: "",
      description: "",
      image: ""
    },
  });

  const trpcUtils = api.useContext();
  const createFeed = api.entrepreneur.feed.create.useMutation({
    onSuccess: (newFeed) => {
      form.setValue("title", "")
      form.setValue("description", "")

      if (session.status !== "authenticated") return;

      trpcUtils.entrepreneur.feed.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCacheFeed = {
          ...newFeed,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              projects: [newCacheFeed, ...oldData.pages[0].projects],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    }
  })

  function onSubmit(values: z.infer<typeof FeedSchema>) {
    createFeed.mutate(values)
  }

  return (
    <>
      <Form {...form}>
        <form className="space-y-6" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="description"
                      className="resize-x"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your project description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Publish
            </button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default NewFeedForm