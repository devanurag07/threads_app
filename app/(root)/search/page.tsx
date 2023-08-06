import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 20,
  });

  console.log(result);

  return (
    <section>
      <h1 className="text-light-2">Search</h1>
      <div className="mt-14 flex flex-col gap-9">
        {result.users.length == 0 ? (
          <>
            <p className="no-result">No Users</p>
          </>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                bio={person.bio}
                personType="user"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
