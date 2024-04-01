"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { MoneySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddMoney } from "@/actions/addMoney";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type BankDetailsProps = {
  upiid: string;
  upinumber: string;
  accountDetails: string;
  ifsccode: string;
  name: string;
  bankName: string;
  accountType: string;
  userId: string;
} | null;

type AddMoneyFormProps = {
  userId: string;
  bankDetails: BankDetailsProps;
};

const AddMoneyForm = ({ bankDetails, userId }: AddMoneyFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof MoneySchema>>({
    resolver: zodResolver(MoneySchema),
    defaultValues: {
      amount: 0,
      transactionId: "",
      upiid: bankDetails?.upiid ?? "",
      upiinumber: bankDetails?.upinumber ?? "",
      accountNumber: bankDetails?.accountDetails ?? "",
      image: undefined,
      ifsccode: bankDetails?.ifsccode ?? "",
      name: bankDetails?.name ?? "",
      accountType: bankDetails?.accountType ?? "",
      bankName: bankDetails?.bankName ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof MoneySchema>) {
    const formData = new FormData();
    formData.append("userId", userId);

    for (const field of Object.keys(values) as Array<keyof typeof values>) {
      if (field === "image") {
        formData.append("image", values[field]);
      } else {
        formData.append(`${field}`, `${values[field]}`);
      }
    }

    startTransition(() => {
      AddMoney(formData).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          form.reset();
          window.location.reload();
        }
        if (data?.error) {
          toast.error(data?.error);
        }
      });
    });
  }
  return (
    <section className="md:overflow-auto md:max-h-[55vh] w-full p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 my-2 md:mt-10"
        >
          <div className="space-y-2 p-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter the amount</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      disabled={isPending}
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter the transaction ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the Transaction ID"
                      autoComplete="off"
                      disabled={isPending}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach the screenshot below:</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      disabled={isPending}
                      placeholder="Attach the screenshot here"
                      type="file"
                      {...form.register("image")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} type="submit" className="w-full md:mb-0">
            Submit Request
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default AddMoneyForm;
