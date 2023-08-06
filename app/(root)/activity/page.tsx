import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //get activity
  const activity = await getActivity(userInfo._id);
  console.log(activity);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length == 0 ? (
          <>
            <p className="text-gray-1">No Activity Yet</p>
          </>
        ) : (
          <>
            {activity.map((act) => (
              <Link key={act._id} href={`/thread/${act.id}`}>
                <article className="activity-card">
                  <Image
                    src={act.author.image}
                    alt="profile picture"
                    width={30}
                    height={30}
                    className="rounded-full !w-8 !h-8"
                  />

                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {act.author.name}
                    </span>{" "}
                    Replied to your thread.
                  </p>
                </article>
              </Link>
            ))}
          </>
        )}
      </section>
    </section>
  );
};

export default Page;
