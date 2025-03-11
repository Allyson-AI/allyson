// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@allyson/ui/dialog";
import { Button } from "@allyson/ui/button";
import { Input } from "@allyson/ui/input";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";
import { useUser } from "@allyson/context";


interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fetchApiKeys: () => void;
}

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  fetchApiKeys,
}: CreateApiKeyDialogProps) {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [newApiKey, setNewApiKey] = useState(null);
  const { makeAuthenticatedRequest } = useUser();

  const handleSubmit = async (name: string) => {
    try {

      if (!name) {
        toast.error("You must enter a name for your API key");
        return;
      }

      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/api-keys/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name }),
        }
      );

      const data = await response.json();

      toast.success("API key created successfully");
      setNewApiKey(data.data.key);
      fetchApiKeys();
    } catch (error) {
      toast.error(error.message || "Failed to create API key");
    }
  };

  const handleCopy = async () => {
    if (newApiKey) {
      await navigator.clipboard.writeText(newApiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setName("");
    onOpenChange(false);
    setNewApiKey(null);
  };

  // Show the API key after creation
  if (newApiKey) {
    return (
      <Dialog open={open} onOpenChange={handleClose} className="">
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
            <DialogDescription>
              Please copy your API key now. You won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2">
              <code className="flex-1 rounded bg-muted p-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                {newApiKey}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2 shrink-0"
              >
                {copied ? (
                  <IconCheck className="h-4 w-4" />
                ) : (
                  <IconCopy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Show the create form
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New API Key</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter API Key Name"
            type="text"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit(name)} disabled={!name.trim()}>
            Create Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
