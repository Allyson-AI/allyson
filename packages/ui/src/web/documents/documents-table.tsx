// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@allyson/ui/table";
import { Button } from "@allyson/ui/button";
import { Search, Upload } from "lucide-react";
import { Input } from "@allyson/ui/input";
import { Card } from "@allyson/ui/card";
import {
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconFile,
  IconMenu2,
  IconTrash,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import FileDialog from "@allyson/ui/web/browser/file-dialog";
import { useUser } from "@allyson/context";

import { Skeleton } from "@allyson/ui/skeleton";
import { useSidebar } from "@allyson/ui/sidebar";
import { Checkbox } from "@allyson/ui/checkbox";
import { Dialog } from "@allyson/ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@allyson/ui/dialog";
import { toast } from "sonner";

export default function DocumentsTable() {
  const { toggleSidebar } = useSidebar();
  const { makeAuthenticatedRequest } = useUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 15;
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const onViewFile = (file) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const url = searchTerm
        ? `${process.env.NEXT_PUBLIC_API_URL}/v1/documents/query?searchTerm=${searchTerm}&page=${currentPage}&limit=${itemsPerPage}`
        : `${process.env.NEXT_PUBLIC_API_URL}/v1/documents?page=${currentPage}&limit=${itemsPerPage}`;

      const response = await makeAuthenticatedRequest(url);
      const data = await response.json();
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setFiles(data.files || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setFiles([]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };
  useEffect(() => {


    fetchDocuments();
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

  const handleDelete = async () => {
    try {
      setLoading(true);
      // Transform selected files into the required format
      const filesToDelete = selectedFiles.map((fileId) => {
        const file = files.find((f) => f.id === fileId);
        return {
          sessionId: file.sessionId,
          fileId: fileId,
          filename: file.filename,
        };
      });

      const response = await makeAuthenticatedRequest(
        "${process.env.NEXT_PUBLIC_API_URL}/v1/documents/delete",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ filesToDelete }),
        }
      );

      if (response.ok) {
        toast.success("Documents deleted successfully");
        // Refresh the documents list
        setCurrentPage(1);
        setSelectedFiles([]);
        fetchDocuments();
      } else {
        toast.error("Failed to delete documents");
      }
    } catch (error) {
      console.error("Error deleting documents:", error);
      toast.error("Failed to delete documents");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(files.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  return (
    <div className="w-full hide-scrollbar">
      <div className="flex justify-between items-center gap-4">
        <p className="md:block hidden text-lg font-semibold">Documents</p>
        <IconMenu2
          className="text-zinc-200 h-7 w-7 md:hidden"
          onClick={toggleSidebar}
        />
        <div className="flex flex-row gap-2">
          {selectedFiles.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading}
            >
              <IconTrash className="h-4 w-4 mr-2" />
              Delete ({selectedFiles.length})
            </Button>
          )}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or ID"
              className="w-full pl-8 md:w-[200px] lg:w-[336px] h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {!files || files.length === 0 ? (
          <Card className="p-6 h-full mt-4 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full bg-zinc-800/50 p-4 h-24 w-24 flex items-center justify-center">
                <IconFile className="w-10 h-10 text-zinc-500" />
              </div>
              <p className="text-sm mt-4 text-zinc-500">
                Files that Allyson creates will appear here.
              </p>
            </div>
          </Card>
        ) : (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      files?.length > 0 && selectedFiles.length === files.length
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Session ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingTableRows />
              ) : (
                files.map((file, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={(checked) => {
                          setSelectedFiles((prev) =>
                            checked
                              ? [...prev, file.id]
                              : prev.filter((id) => id !== file.id)
                          );
                        }}
                        aria-label={`Select ${file.filename}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {file.filename}
                    </TableCell>
                    <TableCell className="font-medium">
                      {file.sessionId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDistanceToNow(new Date(file.timestamp), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {file.size >= 1024 * 1024
                        ? (file.size / 1024 / 1024).toFixed(2) + " MB"
                        : (file.size / 1024).toFixed(2) + " KB"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-sm"
                          onClick={() => onViewFile(file)}
                        >
                          <IconEye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-sm text-destructive"
                          onClick={() => {
                            setSelectedFiles([file.id]);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex justify-center items-center mt-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
        >
          Next
          <IconChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <FileDialog
        selectedFile={selectedFile}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedFiles.length}{" "}
              {selectedFiles.length === 1 ? "file" : "files"}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
