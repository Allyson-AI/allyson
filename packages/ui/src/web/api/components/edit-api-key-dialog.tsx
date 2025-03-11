// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@allyson/ui/dialog";
import { Button } from "@allyson/ui/button";
import { Input } from "@allyson/ui/input";
import { useUser } from "@allyson/context";

import { toast } from "sonner";

interface EditApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: any;
  onSave: (name: string) => void;
  fetchApiKeys: () => void;
}

export function EditApiKeyDialog({
  open,
  onOpenChange,
  apiKey,
  fetchApiKeys,
}: EditApiKeyDialogProps) {
  const [name, setName] = React.useState(apiKey?.name || "");
  const { makeAuthenticatedRequest } = useUser();
  const handleEditKey = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/api-keys/${apiKey.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name }),
        }
      );

      await response.json();
      toast.success("API key updated successfully");
      fetchApiKeys();
      onOpenChange(false);
      setName("");
    } catch (error) {
      toast.error(error.message || "Failed to update API key");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit API Key</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="API Key Name"
          />
        </div>
        <DialogFooter className="flex flex-row justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleEditKey();
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
