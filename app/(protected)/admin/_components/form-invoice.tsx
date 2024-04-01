"use client";
import { acceptInvoice, rejectInvoice } from "@/actions/admin-invoice";
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
} from "@/components/ui/form";
import * as z from "zod";
import { RejectInvoiceSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type InvoiceProps = {
  id: string;
  userId: string;
};

const FormInvoice = ({ id, userId }: InvoiceProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RejectInvoiceSchema>>({
    resolver: zodResolver(RejectInvoiceSchema),
    defaultValues: {
      id: id,
      reason: "",
    },
  });

  const handleAccept = async () => {
    const values = {
      invoiceId:id,
      userId: userId,
    };
    startTransition(() => {
      acceptInvoice(values).then((data) => {
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

  const handleReject = async (values: z.infer<typeof RejectInvoiceSchema>) => {
    startTransition(() => {
      rejectInvoice({ id: id, reason: values.reason }).then((data) => {
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

  return (
    <div className="space-x-2 flex">
      <Button onClick={handleAccept} disabled={isPending}>
        Accept
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Reject</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure??</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleReject)}>
              <div className="py-2">
                <FormField
                  control={form.control}
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
                />{" "}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Submit</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormInvoice;
