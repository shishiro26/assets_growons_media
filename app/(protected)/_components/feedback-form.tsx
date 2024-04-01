"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FeedbackSchema, OrderSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/shared/form-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addFeedback } from "@/actions/feedback";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type User = {
  name: string;
} | null;

type Order = {
  orderId: string;
  User: User;
  createdAt: Date;
};

type FeedbackFormProps = {
  userId: string;
  orders: Order[];
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({ orders, userId }) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),

    defaultValues: {
      userId: userId,
      orderId: "",
      feedback: "",
      file: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof FeedbackSchema>) => {
    setError("");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("orderId", values.orderId);
    formData.append("feedback", values.feedback ?? "");
    formData.append("fileName", values.file?.name ?? "");

    for (const field of Object.keys(values) as Array<keyof typeof values>) {
      if (field === "file") {
        formData.append("file", values[field] ?? "");
      }
    }

    startTransition(() => {
      addFeedback(formData).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        if (data?.success) {
          form.reset();
          toast.success(data.success);
        }
      });
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[100%] md:w-[50%]">
                        {orders.length === 0 ? (
                          <SelectValue placeholder="No orders found" />
                        ) : (
                          <SelectValue placeholder="Select a order Id" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {orders.length !== 0 &&
                        orders.map((order) => {
                          return (
                            <SelectItem
                              key={order.orderId}
                              value={order.orderId}
                            >
                              {order.User?.name} -{" "}
                              {order.createdAt.toDateString()} - {order.orderId}
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
              name="feedback"
              render={({ field }) => (
                <FormItem className="w-[100%]">
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your feedback"
                      rows={5}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach the file below:</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      disabled={isPending}
                      placeholder="Attach the file here"
                      type="file"
                      {...form.register("file")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full md:w-[50%]"
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default FeedbackForm;
