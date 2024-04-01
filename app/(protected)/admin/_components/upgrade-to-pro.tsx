"use client";
import React, { useTransition, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProUserSchema } from "@/schemas";
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
import { FormError } from "@/components/shared/form-error";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import DowngradeToUser from "./downgrade-to-pro";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { addProUser } from "@/actions/user-pro";

type ProUserProps = {
  userId: string;
  role: "PRO" | "BLOCKED" | "ADMIN" | "USER";
  assets: any; // TODO: Define type for this.
};

const ProUser = ({ userId, role, assets }: ProUserProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ProUserSchema>>({
    resolver: zodResolver(ProUserSchema),
    defaultValues: {
      userId: userId,
      amount: 0,
      assets: [
        {
          name: "",
          minAsset: 0,
          maxAsset: 1,
          price: 0,
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    name: "assets",
    control: form.control,
  });

  const onSubmit = (values: z.infer<typeof ProUserSchema>) => {
    startTransition(() => {
      addProUser(values).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
          form.reset();
        }
      });
    });
  };

  return (
    <>
      {role === "PRO" ? (
        <DowngradeToUser userId={userId} />
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"default"}>Upgrade to pro</Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
            <SheetTitle>
              <p className="text-2xl font-bold">Upgrade to pro</p>
            </SheetTitle>
            <Separator className="border border-gray-500" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
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
                  {fields.map((item, index) => (
                    <div key={item.id}>
                      <FormField
                        control={form.control}
                        name={`assets.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              disabled={isPending}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a asset" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {assets.map((asset: any) => {
                                  return (
                                    <SelectItem
                                      value={asset.assetName}
                                      key={asset.id}
                                      className="capitalize"
                                    >
                                      {asset.assetName}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`assets.${index}.minAsset`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum no of assets</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                disabled={isPending}
                                {...field}
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
                          <FormItem>
                            <FormLabel>Maximum no of assets</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                disabled={isPending}
                                {...field}
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
                          <FormItem>
                            <FormLabel>Price of the asset</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                disabled={isPending}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <div>
                    <FormField
                      control={form.control}
                      name="assets"
                      render={() => (
                        <Button
                          type="button"
                          disabled={isPending}
                          className={`mb-2`}
                        >
                          <div className="flex items-center gap-x-3 mt-2 mb-2">
                            <label
                              htmlFor="Assets"
                              className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline`}
                              tabIndex={0}
                              onClick={() => {
                                const lastAsset =
                                  form.getValues().assets[fields.length - 1];

                                if (lastAsset && lastAsset.name.trim() !== "") {
                                  append({
                                    name: "",
                                    minAsset: 0,
                                    maxAsset: 0,
                                    price: 0,
                                  });
                                } else {
                                  toast.error(
                                    "Please fill in the previous asset before adding a new one."
                                  );
                                }
                              }}
                            >
                              Add Asset
                            </label>
                          </div>
                        </Button>
                      )}
                    />
                  </div>
                </div>
                <FormError message={error} />
                <SheetFooter>
                  {form.formState.errors || error ? (
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full"
                    >
                      Upgrade to pro
                    </Button>
                  ) : (
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          type="submit"
                          disabled={isPending}
                          className="w-full"
                        >
                          Upgrade to pro
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  )}
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default ProUser;
