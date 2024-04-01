"use client";
import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditNewsSchema } from "@/schemas";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/shared/form-error";
import { Separator } from "@/components/ui/separator";
import { editNews } from "@/actions/news";
import { toast } from "sonner";

type News = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

type NewsEditFormProps = {
  n: News;
};

const EditNews: React.FC<NewsEditFormProps> = ({ n }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof EditNewsSchema>>({
    resolver: zodResolver(EditNewsSchema),
    defaultValues: {
      id: n?.id,
      title: n?.title,
      content: n?.content,
      userId: n?.userId,
    },
  });

  const onSubmit = (values: z.infer<typeof EditNewsSchema>) => {
    setError("");

    startTransition(() => {
      editNews(values).then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        form.reset();
        toast.success(data.success);
      });
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"default"}>Edit</Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
        <SheetTitle>
          <h1 className="text-2xl font-bold">Edit News</h1>
        </SheetTitle>
        <Separator className="border border-gray-50" />{" "}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title of the news</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Title of the news"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-[100%]">
                    <FormLabel>Content of the news</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Content of the news"
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
            {form.formState.errors ? (
              <Button type="submit" disabled={isPending} className="w-full">
                Edit News
              </Button>
            ) : (
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" disabled={isPending} className="w-full">
                    Edit News
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

export default EditNews;
