"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

// import { updateUser } from "@/lib/actions/user.actions";
import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const CommentForm = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    );
    form.reset();
  };

  return (
    <div>
      <h1 className="text-white">Comment Form</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="comment-form flex items-center justify-center"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center  w-full gap-3">
                <FormLabel>
                  <Image
                    src={currentUserImg}
                    alt="Profile Image"
                    width={48}
                    height={48}
                    className="rounded-full object-cover !w-12 !h-12 "
                  />
                </FormLabel>
                <FormControl className="no-focus border  border-dark-4 bg-dark-3 text-light-1 flex items-center justify-center">
                  <Input
                    type="text"
                    placeholder="Comment..."
                    className="no-focus text-light-1 bg-dark-3 outline-none border-none !m-0"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-primary-500 comment-form-btn">
            Reply
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
