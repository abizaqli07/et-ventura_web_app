import { zodResolver } from "@hookform/resolvers/zod"
import { ROLES } from "@prisma/client"
import { GetServerSideProps } from "next"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import { UseFormReturn, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { RegisterProfileSchema } from "~/components/types/user_auth"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Textarea } from "~/components/ui/textarea"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/utils/api"

export const getServerSideProps: GetServerSideProps<{
  session: Session
}> = async (ctx) => {
  const session = await getServerAuthSession({
    req: ctx.req,
    res: ctx.res
  });

  if (session === null || session === undefined) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      }
    }
  }

  return {
    props: {
      session
    }
  }
}

const RegisterProfile = () => {
  const [[page, direction], setPage] = useState([0, 0])

  const session = useSession();
  const router = useRouter();
  
  const { data, isError, isLoading } = api.client.home.getProfile.useQuery()

  const createProfile = api.auth.createProfile.useMutation({
    async onSuccess(data, variables, context) {
      router.push("/entrepreneur/home").catch((e) => console.log(e))
    },
    onError(error) {
      toast.error(error.message)
    },
  });

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const form = useForm<z.infer<typeof RegisterProfileSchema>>({
    resolver: zodResolver(RegisterProfileSchema),
    defaultValues: {
      username: data?.profile?.username ?? "",
      name: data?.profile?.name ?? "",
      address: data?.profile?.address ?? "",
      phone: data?.profile?.phone ?? "",
      city: data?.profile?.city ?? "",
      country: data?.profile?.country ?? "",
      postCode: String(data?.profile?.postCode) ?? "",
      biography: data?.profile?.biography ?? "",
      interest: data?.profile?.interest ?? "",
      skills: data?.profile?.skills ?? "",
      role: data?.role,
      userId: session.data?.user.id
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterProfileSchema>) {
    createProfile.mutate(values)
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
                {(page === 1) && <UserRole form={form} />}
                {(page === 2) && <PurposeAndInterest form={form} />}
                {(page === 3) && <Skills form={form} />}
                <div>
                  <Button type="button" onClick={() => paginate(-1)}>Previous</Button>
                  <Button type="button" onClick={() => paginate(1)}>Next</Button>
                  <Button type="submit" className={page === 3 ? "" : "hidden"}>Submit</Button>
                </div>
              </form>
            </Form>
          </div>
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
    postCode: string;
    biography: string;
    interest: string;
    skills: string;
    userId: string;
    role: ROLES;
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

const UserRole = ({ form }: {
  form: UseFormReturn<{
    username: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postCode: string;
    biography: string;
    interest: string;
    skills: string;
    userId: string;
    role: ROLES;
  }, any, undefined>
}) => {
  return (
    <>
      <div>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Notify me about...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={ROLES.ENTREPRENEUR} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Entrepreneure
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={ROLES.INVESTOR} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Investor
                    </FormLabel>
                  </FormItem>

                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
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
    postCode: string;
    biography: string;
    interest: string;
    skills: string;
    userId: string;
    role: ROLES;
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
    postCode: string;
    biography: string;
    interest: string;
    skills: string;
    userId: string;
    role: ROLES;
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