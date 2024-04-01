"use client";
import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUserSchema } from "@/schemas";
import * as z from "zod";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
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
import BlockUser from "../../_components/block-user";
import { editUser } from "@/actions/user";
import { toast } from "sonner";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  name: string | null;
  number: string;
  password: string;
  totalMoney: number;
  role: "ADMIN" | "PRO" | "BLOCKED" | "USER";
  createdAt: Date;
};

interface EditUserProps {
  user: User;
}

const EditUser: React.FC<EditUserProps> = ({ user }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      id: user.id,
      name: user.name || "",
      email: user.email,
      number: user.number,
    },
  });

  const onSubmit = (values: z.infer<typeof EditUserSchema>) => {
    setError("");
    startTransition(() => {
      editUser(values).then((data) => {
        if (data.success) {
          toast.success(data.success);
          form.reset();
        }
        if (data.error) {
          setError(data.error);
        }
      });
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"default"}>Edit User</Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
        <SheetTitle>
          <h1 className="text-2xl font-bold">Edit User</h1>
        </SheetTitle>
        <Separator className="border border-gray-500" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={user.role === "BLOCKED" || isPending}
                      placeholder=""
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={user.role === "BLOCKED" || isPending}
                      placeholder=""
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={user.role === "BLOCKED" || isPending}
                      placeholder=""
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex  justify-start items-start flex-wrap">
              <Button asChild variant={"link"} type="button">
                <Link
                  href={`/admin/user/update-money/${user.id}`}
                  target="_blank"
                >
                  Update wallet
                </Link>
              </Button>
              <Button asChild variant={"link"} type="button">
                <Link
                  href={`/admin/user-update-password/${user.id}`}
                  target="_blank"
                >
                  Update password
                </Link>
              </Button>
            </div>
            <FormError message={error} />
            {form.formState.errors || error !== "" ? (
              <Button
                className="w-full"
                type="submit"
                disabled={user.role === "BLOCKED" || isPending}
              >
                Update user
              </Button>
            ) : (
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={user.role === "BLOCKED" || isPending}
                  >
                    Update user
                  </Button>
                </SheetClose>
              </SheetFooter>
            )}
          </form>
        </Form>
        <SheetFooter>
          <BlockUser id={user.id} role={user.role} />
        </SheetFooter>
        {user.role === "PRO" && (
          <Button variant={"link"}>
            <Link
              href={`/admin/user/pro/${user.id}`}
              target="_blank"
              tabIndex={0}
            >
              Edit Pro user
            </Link>
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EditUser;
