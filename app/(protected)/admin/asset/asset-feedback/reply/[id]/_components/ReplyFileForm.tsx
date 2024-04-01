"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { addReplyFile } from "@/actions/feedback";
import { toast } from "sonner";
import {
  Sheet,
  SheetTitle,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { ReplyFileSchema } from "@/schemas";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ReplyFormProps = {
  secure_url: string | null;
  feedback: string | null;
  orderId: string;
  fileName: string | null;
};

const ReplyFileForm: React.FC<ReplyFormProps> = ({
  feedback,
  orderId,
  fileName,
  secure_url,
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ReplyFileSchema>>({
    resolver: zodResolver(ReplyFileSchema),
    defaultValues: {
      orderId: orderId,
      file: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof ReplyFileSchema>) => {
    setError("");
    const formData = new FormData();
    formData.append("orderId", values.orderId);
    formData.append("fileName", values.file.name);

    for (const field of Object.keys(values) as Array<keyof typeof values>) {
      if (field === "file") {
        formData.append("file", values[field]);
      }
    }

    startTransition(() => {
      addReplyFile(formData).then((data) => {
        if (data?.success) {
          toast.success(data.success, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
          form.reset();
        }

        if (data.error) {
          setError(data?.error);
        }
      });
    });
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"default"}>Upload file</Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
        <SheetTitle>
          <p className="text-2xl font-bold">Add Reply</p>
        </SheetTitle>
        <Separator className="border border-gray-500" />
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
                </div>
              )}

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attach the file below:</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        disabled={isPending}
                        placeholder="Attach the file here"
                        type="file"
                        {...form.register("file")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className="text-red-600 text-sm">
                *the file format must be an mp3/mp4
              </span>
            </div>
            <FormError message={error} />
            {form.formState.errors && (
              <Button type="submit" className="w-full" disabled={isPending}>
                Submit Feedback
              </Button>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default ReplyFileForm;
