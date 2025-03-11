// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@allyson/ui/dialog";
import { Button } from "@allyson/ui/button";
import { useUser } from "@allyson/context";

import { toast } from "sonner";

interface DeleteApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: any;
  fetchApiKeys: () => void;
}

export function DeleteApiKeyDialog({
  open,
  onOpenChange,
  apiKey,
  fetchApiKeys,
}: DeleteApiKeyDialogProps) {
  const { makeAuthenticatedRequest } = useUser();
  const handleConfirmDelete = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/api-keys/revoke/${apiKey.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("API key revoked successfully");
        onOpenChange(false);
        fetchApiKeys();
      } else {
        throw new Error(data.error || "Failed to revoke API key");
      }
    } catch (error) {
      toast.error(error.message || "Failed to revoke API key");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke API Key</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke this API key? This action cannot be
            undone. The key will no longer be able to access the API.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Revoke Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
