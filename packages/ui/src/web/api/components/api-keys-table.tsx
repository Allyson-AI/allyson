// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@allyson/ui/table";
import { Button } from "@allyson/ui/button";
import { Card } from "@allyson/ui/card";
import {
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
  IconKey,
  IconTrash,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@allyson/context";

import { Skeleton } from "@allyson/ui/skeleton";
import { cn } from "@allyson/ui/lib/utils";
import { EditApiKeyDialog } from "@allyson/ui/web/api/components/edit-api-key-dialog";
import { DeleteApiKeyDialog } from "@allyson/ui/web/api/components/delete-api-key-dialog";
import { CreateApiKeyDialog } from "@allyson/ui/web/api/components/create-api-key-dialog";
import { toast } from "sonner";

interface ApiKey {
  _id: string;
  keyPreview: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiKeysTableProps {
  searchTerm?: string;
  statusFilter?: string;
  activeTab?: string;
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
}

const LoadingTableRows = () => (
  <>
    {[1, 2, 3].map((i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell>
          <Skeleton className="h-4 w-[150px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[200px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[80px]" />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);

export function ApiKeysTable({
  searchTerm = "",
  statusFilter = "all",
  activeTab = "tab-1",
  createDialogOpen,
  setCreateDialogOpen,
}: ApiKeysTableProps) {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalKeys, setTotalKeys] = useState(0);
  const itemsPerPage = 15;
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);


  const { user, makeAuthenticatedRequest } = useUser();

  const handleEditKey = (key) => {
    setSelectedApiKey(key);
    setEditDialogOpen(true);
  };

  const handleDeleteKey = (key) => {
    setSelectedApiKey(key);
    setDeleteDialogOpen(true);
  };

  const queryApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      const status = statusFilter === "all" ? "" : statusFilter;
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/api-keys/query?status=${status}&searchTerm=${searchTerm}&page=${currentPage}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setApiKeys(data.data);
        setTotalPages(data.totalPages);
        setTotalKeys(data.totalApiKeys);
      } else {
        throw new Error(data.error || "Failed to fetch API keys");
      }
    } catch (error) {
      toast.error("Failed to fetch API keys");
      console.error(error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [
    makeAuthenticatedRequest,
    currentPage,
    statusFilter,
    searchTerm,
    itemsPerPage,
  ]);

  const fetchApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      const status = statusFilter === "all" ? "" : statusFilter;
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/api-keys?page=${currentPage}&limit=${itemsPerPage}&status=${status}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setApiKeys(data.data);
        setTotalPages(data.totalPages);
        setTotalKeys(data.totalApiKeys);
      } else {
        throw new Error(data.error || "Failed to fetch API keys");
      }
    } catch (error) {
      toast.error("Failed to fetch API keys");
      console.error(error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [
    makeAuthenticatedRequest,
    currentPage,
    statusFilter,
    searchTerm,
    itemsPerPage,
  ]);

  useEffect(() => {
    if (activeTab === "tab-1" && searchTerm) {
      const timer = setTimeout(() => {
        queryApiKeys();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, queryApiKeys]);

  useEffect(() => {
    if (activeTab === "tab-1" && !searchTerm) {
      fetchApiKeys();
    }
  }, [currentPage, searchTerm]);

  const LoadingTableRows = () => (
    <>
      {[1, 2, 3].map((i) => (
        <TableRow key={`skeleton-${i}`}>
          <TableCell>
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[60px]" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-[60px] ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:h-full hide-scrollbar h-screen mt-2">
        <main className="flex-1 flex overflow-hidden">
          <div className="w-full flex flex-col z-30 overflow-hidden hide-scrollbar">
            <div className="w-full h-full relative">
              <div className={`h-full overflow-auto hide-scrollbar`}>
                <div className="w-full hide-scrollbar">
                  <div className="flex-1 overflow-y-auto hide-scrollbar">
                    {!apiKeys || apiKeys.length === 0 ? (
                      <Card className="p-6 h-full mt-2 flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="rounded-full bg-zinc-800/50 p-4 h-24 w-24 flex items-center justify-center">
                            <IconKey className="w-10 h-10 text-zinc-500" />
                          </div>
                          <p className="text-sm mt-4 text-zinc-500">
                            API keys that you create will appear here.
                          </p>
                        </div>
                      </Card>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Secret Key</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <LoadingTableRows />
                          ) : !apiKeys?.length ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center">
                                No API keys found
                              </TableCell>
                            </TableRow>
                          ) : (
                            apiKeys.map((key, index) => (
                              <TableRow key={key.id || `key-${index}`}>
                                <TableCell>{key.name}</TableCell>
                                <TableCell className="">
                                  <code className="rounded bg-muted px-2 py-1">
                                    {key.keyPreview}
                                  </code>
                                </TableCell>
                                <TableCell className="">
                                  {key.createdAt
                                    ? formatDistanceToNow(
                                        new Date(key.createdAt)
                                      ) + " ago"
                                    : "Unknown"}
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={cn(
                                      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                      key.isActive
                                        ? "bg-[#254E30] text-[#4A9E62]"
                                        : "bg-[#302334] text-[#8c679b]"
                                    )}
                                  >
                                    {key.isActive ? "Active" : "Inactive"}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right flex flex-row md:block items-center mt-2 md:mt-0">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditKey(key)}
                                  >
                                    <IconEdit className="h-4 w-4 text-zinc-400" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDeleteKey(key)}
                                    className="ml-2"
                                  >
                                    <IconTrash className="h-4 w-4 text-zinc-400" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
                <div className="flex justify-center items-center mt-4 space-x-2 pb-[100px]">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1 || loading}
                  >
                    <IconChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-zinc-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || loading}
                  >
                    Next
                    <IconChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <EditApiKeyDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        apiKey={selectedApiKey}
        fetchApiKeys={fetchApiKeys}
      />

      <DeleteApiKeyDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        apiKey={selectedApiKey}
        fetchApiKeys={fetchApiKeys}
      />

      <CreateApiKeyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        fetchApiKeys={fetchApiKeys}
      />
    </>
  );
}
