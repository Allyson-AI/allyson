// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@allyson/ui/dialog";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { Button } from "@allyson/ui/button";

export default function FileDialog({
  selectedFile,
  isModalOpen,
  setIsModalOpen,
}) {
  const [fileContent, setFileContent] = useState("");
  useEffect(() => {
    async function fetchTextContent() {
      if (selectedFile?.filename.match(/\.(txt|md)$/i)) {
        try {
          const response = await fetch("/api/fetch-file", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: selectedFile.signedUrl }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const text = await response.text();
          setFileContent(text);
        } catch (error) {
          console.error("Error fetching file content:", error);
          setFileContent("Error loading file content");
        }
      }
    }

    if (selectedFile) {
      fetchTextContent();
    }

    return () => setFileContent("");
  }, [selectedFile]);
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.filename}</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="mt-4">
              {selectedFile.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={selectedFile.signedUrl}
                  alt={selectedFile.filename}
                  className="max-h-[70vh] w-auto mx-auto"
                />
              ) : selectedFile.filename.match(/\.(pdf)$/i) ? (
                <iframe
                  src={selectedFile.signedUrl}
                  className="w-full h-[70vh]"
                  title={selectedFile.filename}
                />
              ) : selectedFile.filename.match(/\.md$/i) ? (
                <div className="prose dark:prose-invert max-h-[70vh] overflow-y-auto p-4">
                  <ReactMarkdown>{fileContent}</ReactMarkdown>
                </div>
              ) : selectedFile.filename.match(/\.txt$/i) ? (
                <pre className="max-h-[70vh] overflow-y-auto p-4 whitespace-pre-wrap break-words bg-zinc-50 dark:bg-zinc-900 rounded-md">
                  {fileContent}
                </pre>
              ) : (
                <div className="text-center text-zinc-500">
                  This file type cannot be previewed. Please download to view.
                </div>
              )}
            </div>
          )}
          <Button variant="outline" onClick={() => window.open(selectedFile.signedUrl, '_blank')}>
            Download
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
