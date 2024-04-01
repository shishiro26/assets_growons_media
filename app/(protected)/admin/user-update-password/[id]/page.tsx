"use client";
import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePasswordSchema } from "@/schemas";
import * as z from "zod";
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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/actions/user";

const UpdatePassword = ({ params }: { params: { id: string } }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      id: params.id,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof UpdatePasswordSchema>) => {
    setError("");
    startTransition(() => {
      updatePassword(values).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          form.reset();
          setTimeout(() => {
            window.close();
          }, 2000);
        }

        if (data?.error) {
          setError(data.error);
        }
      });
    });
  };
  return (
    <section className="p-2 m-2 ">
      <h1 className="text-3xl my-3">Update password</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-[50%]"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder=""
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder=""
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <Button className="w-full" type="submit" disabled={isPending}>
            Update Password
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default UpdatePassword;
