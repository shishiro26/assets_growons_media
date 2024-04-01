"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FeedbackSchema, OrderSchema, ReplySchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/shared/form-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addReply } from "@/actions/feedback";
import { toast } from "sonner";
import ReplyFileForm from "./ReplyFileForm";
import FileDownload from "@/app/(protected)/admin/_components/file-download";

type ReplyFormProps = {
  secure_url: string | null;
  feedback: string | null;
  orderId: string;
  fileName: string | null;
};

const ReplyForm: React.FC<ReplyFormProps> = ({
  feedback,
  orderId,
  fileName,
  secure_url,
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const form = useForm<z.infer<typeof ReplySchema>>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      orderId: orderId,
      reply: "",
      feedback: feedback ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof ReplySchema>) => {
    setError("");
    console.log(form.formState.errors);
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {feedback && (
              <FormItem>
                <FormLabel>Feedback</FormLabel>
                <FormControl>
                  <Textarea value={feedback} disabled />
                </FormControl>
              </FormItem>
            )}

            {secure_url && (
              <div className="flex flex-row items-center">
                <p className="capitalize font-bold">{fileName}</p>
                <FileDownload
                  secure_url={secure_url ?? ""}
                  fileName={fileName ?? ""}
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="reply"
              render={({ field }) => (
                <FormItem className="w-[100%]">
                  <FormLabel>Reply</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your reply"
                      rows={5}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full md:w-[50%]"
          >
            Submit
          </Button>
        </form>
      </Form>
      <div className="mt-3">
        <ReplyFileForm
          feedback={feedback ?? ""}
          orderId={orderId}
          secure_url={secure_url ?? ""}
          fileName={fileName ?? ""}
        />
      </div>
    </>
  );
};

export default ReplyForm;
