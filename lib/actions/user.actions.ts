"use server";

import { FilterQuery } from "mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
// import User from "@/lib/models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

interface Params {
  userId: string;
  username: string;
  bio: string;
  name: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  bio,
  name,
  image,
  path,
}: Params): Promise<void> {
  await connectToDB();

  console.log("worling my ass off");
  console.log({
    userId,
    username,
    bio,
    name,
    image,
    path,
  });
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    await connectToDB();
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return threads;
  } catch (err: any) {
    throw new Error(`Error fetching user posts ${err.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
}) {
  try {
    await connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: {
        $ne: userId,
      },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = {
      createdAt: sortBy,
    };

    const usersQuery = User.find(query)
      .sort({
        createdAt: "desc",
      })
      .skip(skipAmount)
      .limit(pageSize);

    const usersQuery2 = usersQuery.clone();
    const users = await usersQuery.exec();
    const totalUsersCount = await usersQuery2.countDocuments(query);

    const isNext = totalUsersCount > skipAmount + users.length;

    return {
      users,
      isNext,
    };
  } catch (err: any) {
    throw new Error(`Failed to fetch users ${err.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();
    //find all thread created buy the user
    const userThreads = await Thread.find({ author: userId });
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id ",
    });
    return replies;
  } catch (err: any) {
    throw new Error(`Error getting activitiy ${err.message}`);
  }
}
