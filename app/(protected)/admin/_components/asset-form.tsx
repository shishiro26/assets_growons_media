"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import * as z from "zod";
import { AssetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { addAsset } from "@/actions/assets";
import { toast } from "sonner";

const AssetForm = ({ userId }: { userId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof AssetSchema>>({
    resolver: zodResolver(AssetSchema),
    defaultValues: {
      userId: userId,
      assetName: "",
      price: 0,
      description: "",
      minAsset: 0,
      maxAsset: 1,
      stock: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof AssetSchema>) => {
    setError("");
    startTransition(() => {
      addAsset(values).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          form.reset();
        }
        if (data?.error) {
          setError(data.error);
        }
      });
    });
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full md:w-[50%]"
        >
          <div className="space-y-4 ">
            <FormField
              control={form.control}
              name="assetName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Asset Name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Asset Description"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily stock</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="minAsset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Asset</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxAsset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Asset</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormError message={error} />
          <Button type="submit" disabled={isPending} className="w-full">
            Add Asset
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AssetForm;
