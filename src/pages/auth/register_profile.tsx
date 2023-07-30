import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useState } from "react"
import { UseFormReturn, useForm } from "react-hook-form"
import { z } from "zod"
import { RegisterProfileSchema } from "~/components/types/user_auth"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"


const RegisterProfile = () => {
  const [[page, direction], setPage] = useState([0, 0])
  const session = useSession()

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const form = useForm<z.infer<typeof RegisterProfileSchema>>({
    resolver: zodResolver(RegisterProfileSchema),
    defaultValues: {
      username: "",
      name: "",
      address: "",
      phone: "",
      city: "",
      country: "",
      postCode: 0,
      biography: "",
      interest: "",
      skills: "",
      userId: session.data?.user.id
    },
  })

  async function onSubmit(values: z.infer<typeof RegisterProfileSchema>) {
    console.log(values)
  }


  return (
    <>
      <Head>
        <title>Register Profile</title>
      </Head>
      <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>
        <div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <Form {...form}>
              <form className="space-y-6" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
                {(page === 0) && <PersonalData form={form} />}
                {(page === 1) && <UserRole />}
                {(page === 2) && <PurposeAndInterest form={form} />}
                {(page === 3) && <Skills form={form} />}
              </form>
            </Form>
          </div>
        </div>
        <div>
          <Button onClick={() => paginate(-1)}>Previous</Button>
          <Button onClick={() => paginate(1)}>Next</Button>
        </div>
      </main>
    </>
  )
}

const PersonalData = ({ form }: {
  form: UseFormReturn<{
    username: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postCode: number;
    biography: string;
    interest: string;
    skills: string;
    userId: string;
  }, any, undefined>
}) => {
  return (
    <>

      <div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your fullname"
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your address"
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="City you live"
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
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Country you live"
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
          name="postCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

    </ >
  )
}

const UserRole = () => {
  return (
    <>
      <div>Entrepreneur</div>
      <div>Investor</div>
    </>
  )
}

const PurposeAndInterest = ({ form }: {
  form: UseFormReturn<{
    username: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postCode: number;
    biography: string;
    interest: string;
    skills: string;
    userId: string;
  }, any, undefined>
}) => {
  return (
    <>
      <div>
        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Purposes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Seeking funding for my project, Finding business collaborators, Looking for interesting projects to invest in"
                  className="resize-x"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kindly share your reasons for joining this platform, et-Ventura. We value your insights to tailor a personalized experience.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={form.control}
          name="interest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Interest</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., I'm interested in finding innovative technology projects, I'm looking for experienced investors in the e-commerce industry"
                  className="resize-x"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kindly share your reasons for joining this platform, et-Ventura. We value your insights to tailor a personalized experience.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}

const Skills = ({ form }: {
  form: UseFormReturn<{
    username: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postCode: number;
    biography: string;
    interest: string;
    skills: string;
    userId: string;
  }, any, undefined>
}) => {
  return (
    <>
      <div>
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Skills</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Digital Marketing, App Development, Finance, Business Strategy"
                  className="resize-x"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tell us about your specific skills in the business or investment field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}

export default RegisterProfile