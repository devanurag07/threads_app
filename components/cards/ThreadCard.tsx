import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];

  isComment?: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  console.log(author);
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile Image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar"></div>
          </div>

          <div>
            {" "}
            <Link
              href={`/profile/${author.id}`}
              className="relative h-11 w-fit "
            >
              <h4 className="cursor-pointer text-light-1 text-base-semibold">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className={`${isComment && "mb-10"} flex gap-3.5 mt-1`}>
              <Image
                src="/assets/heart-gray.svg"
                alt="heart"
                height={24}
                width={24}
              />
              <Link href={`/thread/${id}`}>
                <Image
                  src="/assets/reply.svg"
                  alt="reply"
                  height={24}
                  width={24}
                />
              </Link>
              <Image
                src="/assets/repost.svg"
                alt="repost"
                height={24}
                width={24}
              />{" "}
              <Image
                src="/assets/share.svg"
                alt="share"
                height={24}
                width={24}
              />{" "}
            </div>
            {isComment && comments.length > 0 && (
              <Link href={`/thread/${id}`}>
                <p className="mt-1 text-subtle-medium text-gray-1">
                  {comments.length} Replies
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
