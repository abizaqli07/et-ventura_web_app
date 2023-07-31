import { useRouter } from "next/router"
import toast from "react-hot-toast"
import { api } from "~/utils/api"

const home = () => {
  const router = useRouter()
  const user = api.client.home.getProfile.useQuery()

  if (user.data?.profile === null) {
    router.push("/auth/register_profile").catch((e) => console.log(e))
  }

  if (user.isError) {
    toast.error(user.error.message)
  }

  return (
    <div>
      <div>User Profile</div>
      <div>Name : {user.data?.profile?.name}</div>
      <div>Name : {user.data?.profile?.address}</div>
      <div>Role : {user.data?.role}</div>
    </div>
  )
}

export default home