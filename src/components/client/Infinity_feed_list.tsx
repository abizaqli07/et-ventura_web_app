import Link from 'next/link'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { api } from '~/utils/api'

type Project = {
  id: string,
  title: string,
  description: string,
  image: string | null,
  createdAt: Date,
  likeCount: number,
  likedByMe: boolean,
  user: {
    id: string,
    image: string | null,
    name: string | null
  }
}

type InfiniteFeedsProps = {
  isLoading: boolean,
  isError: boolean,
  hasMore: boolean | undefined,
  fetchNewFeeds: () => Promise<unknown>
  feeds?: Project[]
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "short" })

const InfinityFeedList = ({ feeds, isLoading, isError, hasMore = false, fetchNewFeeds }: InfiniteFeedsProps) => {

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Error...</h1>

  if (feeds == null || feeds?.length === 0) {
    return <h2 className=" my-4 text-center text-2xl text-gray-500">No Feeds</h2>
  }


  return (
    <InfiniteScroll
      dataLength={feeds.length}
      next={fetchNewFeeds}
      hasMore={hasMore}
      loader={"Loading..."}
    >
      {feeds.map((tweet) => {
        return <FeedCard key={tweet.id} {...tweet} />
      })}
    </InfiniteScroll>
  )
}

const FeedCard = ({ id, user, title, description, image, createdAt, likeCount, likedByMe }: Project) => {
  const trpcUtils = api.useContext()
  // const toggleLike = api.tweet.toggleLike.useMutation({
  //   onSuccess: ({ addedLike }) => {
  //     const updateData: Parameters<typeof trpcUtils.tweet.infiniteFeed.setInfiniteData>[1] = (oldData) => {
  //       if (oldData == null) return;
  //       const countModifier = addedLike ? 1 : -1;

  //       return {
  //         ...oldData,
  //         pages: oldData.pages.map((page) => {
  //           return {
  //             ...page,
  //             tweets: page.tweets.map((tweet) => {
  //               if (tweet.id === id) {
  //                 return {
  //                   ...tweet,
  //                   likeCount: tweet.likeCount + countModifier,
  //                   likedByMe: addedLike,
  //                 }
  //               }

  //               return tweet;
  //             })
  //           }
  //         })
  //       }
  //     }


  //     trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData)
  //   }
  // })

  function handleToggleLike() {
    // toggleLike.mutate({ id })
  }

  return (
    <li className=" flex gap-4 border-b px-4 py-4">
      <Link href={`/`}>
        <Avatar>
          <AvatarImage src={user.image !== null ? user.image : "/"} />
          <AvatarFallback>Image</AvatarFallback>
        </Avatar>
      </Link>
      <div className=" flex flex-grow flex-col">
        <div className=" flex gap-1">
          <Link className=" font-bold outline-none hover:underline focus-visible:underline" href={`/profiles/${user.id}`}>
            {user.name}
          </Link>
          <span className=" text-gray-500">-</span>
          <span className=" text-gray-500">{dateTimeFormatter.format(createdAt)}</span>
        </div>
        <div>
          <p className=" whitespace-pre-wrap">{title}</p>
          <div className=" whitespace-pre-wrap">{description}</div>
        </div>
        {/* <HeartButton onClick={handleToggleLike} isLoading={toggleLike.isLoading} likedByMe={likedByMe} likeCount={likeCount} /> */}
      </div>
    </li>
  )
}

export default InfinityFeedList