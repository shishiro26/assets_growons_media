"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { BankDetailsSchema } from "@/schemas";
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
import { addBankDetails } from "@/actions/add-bank-details";
import { toast } from "sonner";
import { FormError } from "@/components/shared/form-error";

const BankDetailsForm = ({ userId }: { userId: string }) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof BankDetailsSchema>>({
    resolver: zodResolver(BankDetailsSchema),
    defaultValues: {
      accountDetails: "",
      upiid: "",
      upinumber: "",
      image: undefined,
      userId: userId,
      name: "",
      bankName: "",
      accountType: "",
      ifsccode: "",
    },
  });

  function onSubmit(values: z.infer<typeof BankDetailsSchema>) {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("accountDetails", values.accountDetails);
    formData.append("upiid", values.upiid);
    formData.append("upinumber", values.upinumber);
    formData.append("name", values.name);
    formData.append("bankName", values.bankName);
    formData.append("accountType", values.accountType);
    formData.append("ifsccode", values.ifsccode);

    for (const field of Object.keys(values) as Array<keyof typeof values>) {
      if (field === "image") {
        formData.append("image", values[field]);
      }
    }

    startTransition(() => {
      addBankDetails(formData).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        if (data?.success) {
          toast.success(data.success);
          form.reset();
        }
      });
    });
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"link"}>Add Bank Details</Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
        <SheetTitle>
          <h1 className="text-2xl font-bold">Add Details</h1>
        </SheetTitle>
        <Separator className="border border-gray-500" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter the Name"
                        type="text"
                        {...form.register("name")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter the Bank Name"
                        type="text"
                        {...form.register("bankName")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter the Account Type"
                        type="text"
                        {...form.register("accountType")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifsccode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter the IFSC Code"
                        type="text"
                        {...form.register("ifsccode")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter the account Details"
                        type="text"
                        {...form.register("accountDetails")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="upiid"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter the UPI ID"
                        type="text"
                        {...form.register("upiid")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="upinumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter the UPI NUMBER"
                        type="text"
                        {...form.register("upinumber")}
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
                    <FormLabel>Attach the QR below:</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        disabled={isPending}
                        placeholder="Attach the QR here"
                        type="file"
                        {...form.register("image")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className="text-red-600 text-sm">
                * Remove background before uploading the QR
              </span>
            </div>
            <FormError message={error} />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full md:mb-0"
            >
              Add Details
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default BankDetailsForm;
