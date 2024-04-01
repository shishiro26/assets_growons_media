"use client";
import { Button } from "@/components/ui/button";
import {
  SheetTrigger,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReplySchema } from "@/schemas";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addReply } from "@/actions/feedback";
import { toast } from "sonner";

const AddReplyPage = ({
  orderId,
  feedback,
  secure_url,
}: {
  orderId: string;
  feedback: string;
  secure_url: string | null;
}) => {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>();

  const form = useForm<z.infer<typeof ReplySchema>>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      orderId: orderId,
      reply: "",
      feedback: feedback,
    },
  });

  const onSubmit = async (values: z.infer<typeof ReplySchema>) => {
    setError("");
    startTransition(() => {
      addReply(values).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          form.reset();
        }
        if (data?.error) {
          setError("");
        }
      });
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"link"}>Add Reply</Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
        <SheetTitle>
          <p>Add Reply</p>
        </SheetTitle>
        <Separator className="border border-gray-200" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {feedback && (
                <FormField
                  control={form.control}
                  name="reply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled
                          readOnly
                          value={feedback}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {secure_url && (
                <audio controls>
                  <source src={secure_url} type="audio/mp4" width={50} height={50}/>
                </audio>
              )}
              <FormField
                control={form.control}
                name="reply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reply for the feedback</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter reply for the feedback"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.formState.errors && error ? (
              <Button
                variant="default"
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                Add Reply
              </Button>
            ) : (
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    variant="default"
                    type="submit"
                    disabled={isPending}
                    className="w-full"
                  >
                    Add Reply
                  </Button>
                </SheetClose>
              </SheetFooter>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddReplyPage;
