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
import { EditAssetFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { editAsset } from "@/actions/assets";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

type Asset = {
  id: string;
  assetName: string;
  description: string;
  price: number;
  minAsset: number;
  maxAsset: number;
  stock: number;
} | null;

type AssetEditFormProps = {
  asset: Asset;
};

const AssetEditForm: React.FC<AssetEditFormProps> = ({ asset }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof EditAssetFormSchema>>({
    resolver: zodResolver(EditAssetFormSchema),
    defaultValues: {
      id: asset?.id,
      assetName: asset?.assetName,
      price: asset?.price,
      description: asset?.description,
      minAsset: asset?.minAsset,
      maxAsset: asset?.maxAsset,
      stock: asset?.stock,
    },
  });

  const onSubmit = (values: z.infer<typeof EditAssetFormSchema>) => {
    setError("");
    startTransition(() => {
      editAsset(values).then((data) => {
        if (data.error) {
          setError(data.error);
        }

        if (data.success) {
          router.push("/admin/asset/asset-table");
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
            Edit Asset
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AssetEditForm;
