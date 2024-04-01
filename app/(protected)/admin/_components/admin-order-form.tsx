"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import React, { useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { AcceptOrderSchema, RejectOrderSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptOrder, rejectOrder } from "@/actions/admin-order";

type InvoiceProps = {
  id: string;
  userId: string;
  amount: number;
};

const AdminOrderForm = ({ id, amount, userId }: InvoiceProps) => {
  const [isPending, startTransition] = useTransition();

  const rejectForm = useForm<z.infer<typeof RejectOrderSchema>>({
    resolver: zodResolver(RejectOrderSchema),
    defaultValues: {
      id: id,
      reason: "",
      userId: userId,
      amount: amount,
    },
  });

  const acceptForm = useForm<z.infer<typeof AcceptOrderSchema>>({
    resolver: zodResolver(AcceptOrderSchema),
    defaultValues: {
      id: id,
      files: undefined,
    },
  });

  const handleAccept = async (values: z.infer<typeof AcceptOrderSchema>) => {
    const formData = new FormData();

    formData.append("id", values.id);

    if (values.files) {
      for (let i = 0; i < values.files.length; i++) {
        console.log(values.files[i]);
        formData.append(`files[${i}]`, values.files[i] ?? "");
        formData.append(
          `fileName[${i}][fileName]`,
          values?.files[i]?.name ?? ""
        );
        formData.append(
          `fileType[${i}][fileType]`,
          values?.files[i]?.type ?? ""
        );
      }
    }

    startTransition(() => {
      acceptOrder(formData).then((data) => {
        if (data?.success) {
          toast.success(data.success, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
        }
        if (data?.error) {
          toast.error(data.error, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
        }
      });
    });
  };

  const handleReject = async (values: z.infer<typeof RejectOrderSchema>) => {
    startTransition(() => {
      rejectOrder(values).then((data) => {
        if (data?.success) {
          toast.success(data.success, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
          rejectForm.reset();
        }
        if (data?.error) {
          toast.error(data.error, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
        }
      });
    });
  };

  return (
    <div className="space-x-2 flex">
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={isPending}>Accept</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Accept the order :</DialogTitle>
          </DialogHeader>
          <Form {...acceptForm}>
            <form
              onSubmit={acceptForm.handleSubmit(handleAccept)}
              className="space-y-4"
            >
              <div>
                <FormField
                  control={acceptForm.control}
                  name="files"
                  render={({ field: { onChange, onBlur, name } }) => (
                    <FormItem>
                      <FormLabel>Attach the file below:</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          disabled={isPending}
                          placeholder="Attach the screenshot here"
                          type="file"
                          multiple
                          name={name}
                          onChange={(e) =>
                            onChange([...Array.from(e.target.files ?? [])])
                          }
                          onBlur={onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {acceptForm.formState.errors ? (
                <Button type="submit" disabled={isPending}>
                  Confirm
                </Button>
              ) : (
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit" disabled={isPending}>
                      Confirm
                    </Button>
                  </DialogClose>
                </DialogFooter>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Reject</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure??</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <Form {...rejectForm}>
            <form onSubmit={rejectForm.handleSubmit(handleReject)}>
              <div className="py-2">
                <FormField
                  control={rejectForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Reason for rejection"
                          autoComplete="off"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {rejectForm.formState.errors ? (
                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
              ) : (
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit" disabled={isPending}>
                      Submit
                    </Button>
                  </DialogClose>
                </DialogFooter>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrderForm;
