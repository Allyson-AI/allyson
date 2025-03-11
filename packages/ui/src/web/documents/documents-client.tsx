// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";

import DocumentsTable from "@allyson/ui/web/documents/documents-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@allyson/ui/dialog";
import { Button } from "@allyson/ui/button";
import { useUser } from "@allyson/context";

import { Skeleton } from "@allyson/ui/skeleton";
import { IconChevronLeft, IconChevronRight, IconTrash } from "@tabler/icons-react";
import SidebarMenuComponent from "@allyson/ui/layout/sidebar";

export default function DocumentsClient() {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, makeAuthenticatedRequest, getToken } = useUser();
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const handleViewFile = async (file) => {
    setSelectedFile(file);
    setIsModalOpen(true);
    setIsLoading(true);
    setFileUrl(file.signedUrl);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = files.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="flex flex-col md:flex-row md:h-full hide-scrollbar h-screen">
        <div className="md:flex">
          <SidebarMenuComponent />
        </div>
        <main className="flex-1 flex p-4 overflow-hidden">
          <div className="w-full flex flex-col z-30 overflow-hidden hide-scrollbar">
            <div className="w-full h-full relative">
              <div className={`h-full overflow-auto hide-scrollbar`}>
                <DocumentsTable
                  files={files}
                  onViewFile={handleViewFile}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
                
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="w-full h-[600px]" />
            ) : (
              selectedFile && (
                <>
                  {selectedFile.type.startsWith("image/") ? (
                    <img
                      src={fileUrl}
                      alt={selectedFile.originalName}
                      className="max-w-full h-auto"
                    />
                  ) : (
                    <iframe
                      src={fileUrl}
                      title={selectedFile.originalName}
                      width="100%"
                      height="600px"
                    />
                  )}
                </>
              )
            )}
            <div className="flex flex-row justify-between items-center">
              <Button
                onClick={() =>
                  handleFileDelete(
                    selectedFile?.fileName,
                    selectedFile?.originalFileName
                  )
                }
                className="mt-2 bg-red-600"
                variant="destructive"
              >
                {" "}
                <IconTrash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
