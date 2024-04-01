"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { AddSupportLinkForm } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
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
import { FormError } from "@/components/shared/form-error";
import { addLink } from "@/actions/add-link";
import { toast } from "sonner";

const SupportLinkForm = ({ userId }: { userId: string }) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AddSupportLinkForm>>({
    resolver: zodResolver(AddSupportLinkForm),
    defaultValues: {
      link: "",
      userId: userId,
    },
  });

  function onSubmit(values: z.infer<typeof AddSupportLinkForm>) {
    setError("");
    startTransition(() => {
      addLink(values).then((data) => {
        if (data.error) {
          setError(data.error);
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    });
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"link"}>Add link</Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
        <SheetTitle>
          <p className="text-2xl font-bold">Add support link</p>
        </SheetTitle>
        <Separator className="border border-gray-500" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Add link"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full md:mb-0"
            >
              Add support link
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default SupportLinkForm;
