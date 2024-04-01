import React from "react";
import { Button } from "@/components/ui/button";
import { removeProUser } from "@/actions/user-pro";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const DowngradeToUser = ({ userId }: { userId: string }) => {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const handleRemove = (userId: string) => {
    startTransition(() => {
      removeProUser(userId).then((data) => {
        if (data?.success) {
          toast.success(data.success, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
        }
        if (data?.error) {
          setError(data.error);
        }
      });
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"} disabled={isPending}>
          Remove pro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Downgrade to user</DialogTitle>
          <DialogDescription>
            Are you sure you want to downgrade this user to a normal user?
          </DialogDescription>
        </DialogHeader>
        <p>By this user will lose all the benefits of being a pro user.</p>
        {error ? (
          <Button variant={"destructive"} onClick={() => handleRemove(userId)}>
            Confirm
          </Button>
        ) : (
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={() => handleRemove(userId)}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DowngradeToUser;
