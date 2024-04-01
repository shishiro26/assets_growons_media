"use client";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { updateMoneySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateMoney } from "@/actions/user";
import { toast } from "sonner";

const UpdateMoneyForm = ({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof updateMoneySchema>>({
    resolver: zodResolver(updateMoneySchema),
    defaultValues: {
      userId: userId,
      amount: amount,
    },
  });

  const onSubmit = (values: z.infer<typeof updateMoneySchema>) => {
    setError("");
    startTransition(() => {
      updateMoney(values).then((data) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.success) {
          form.reset();
          toast.success(data.success);
          setTimeout(() => {
            window.close();
          }, 2000);
        }
      });
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isPending}>update amount</Button>
      </form>
    </Form>
  );
};

export default UpdateMoneyForm;
