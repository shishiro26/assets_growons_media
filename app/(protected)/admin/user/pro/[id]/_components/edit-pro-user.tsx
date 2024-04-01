"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editProUserSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { editProUser } from "@/actions/user-pro";
import { toast } from "sonner";

interface Asset {
  name: string;
  minAsset: number;
  maxAsset: number;
  price: number;
}

interface Subscription {
  id: string;
  amount_limit: number;
  amount: number;
  assets: Asset[];
  proRecharge: boolean;
  isRecharged: boolean;
  userId: string;
}

type ProUserProps = {
  user: Subscription | null;
};

const EditProUserForm = ({ user }: ProUserProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof editProUserSchema>>({
    resolver: zodResolver(editProUserSchema),
    defaultValues: {
      userId: user?.id,
      amount: user?.amount_limit,
      assets: user?.assets || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "assets",
    control: form.control,
  });

  const onSubmit = (values: z.infer<typeof editProUserSchema>) => {
    setError("");
    startTransition(() => {
      editProUser(values).then((data) => {
        if (data?.error) {
          setError(data.error);
          toast.error(data.error);
        }

        if (data?.success) {
          toast.success(data.success);
          setTimeout(() => {
            window.close();
          }, 2000);
        }
      });
    });
  };

  return (
    <section className="m-2 p-2">
      <h1 className="text-3xl my-3">Update pro user </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Enter the amount limit</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter the amount limit"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:h-[50vh] overflow-y-auto space-y-2">
              {fields.map((asset, index) => (
                <div key={asset.id} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`assets.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Asset Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter asset name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`assets.${index}.minAsset`}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Minimum asset</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter minimum asset"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`assets.${index}.maxAsset`}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Maximum Asset</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter maximum asset"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`assets.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter price"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => remove(index)}
                    className="w-full md:w-[50%]"
                    disabled={isPending}
                  >
                    Remove asset
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant={"secondary"}
                onClick={() =>
                  append({
                    name: "",
                    minAsset: 0,
                    maxAsset: 1,
                    price: 0,
                  })
                }
                disabled={isPending}
                className="w-full md:w-[50%]"
              >
                Add Asset
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full md:w-[50%]"
            disabled={isPending}
          >
            Update
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default EditProUserForm;
