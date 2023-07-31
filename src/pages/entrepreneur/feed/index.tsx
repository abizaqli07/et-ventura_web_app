import { NextPage } from "next";
import { useSession } from "next-auth/react";
import InfinityFeedList from "~/components/client/Infinity_feed_list";
import NewFeedForm from "~/components/client/new_feed_form";
import { api } from "~/utils/api"

const EntrepreneurFeed: NextPage = () => {
  const session = useSession()

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className=" mb-2 px-4 text-lg font-bold">Home</h1>
      </header>

      <div className=" flex flex-col gap-6 w-full min-h-screen max-w-[700px] mx-auto">
        <NewFeedForm />
        <RecentFeeds />
      </div>
    </>
  );
};

const RecentFeeds = () => {
  const feeds = api.entrepreneur.feed.infiniteFeed.useInfiniteQuery({}, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })

  return (
    <InfinityFeedList
      feeds={feeds.data?.pages.flatMap(page => page.projects)}
      isError={feeds.isError}
      isLoading={feeds.isLoading}
      hasMore={feeds.hasNextPage}
      fetchNewFeeds={feeds.fetchNextPage}
    />
  )
}

export default EntrepreneurFeed