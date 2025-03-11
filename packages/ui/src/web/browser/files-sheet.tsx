// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@allyson/ui/sheet";
import { IconFiles, IconEye, IconDownload } from "@tabler/icons-react";
import FileDialog from "@allyson/ui/web/browser/file-dialog";
import { Button } from "@allyson/ui/button";

interface File {
  filename: string;
  signedUrl: string;
}

interface FilesSheetProps {
  files: File[];
}

export default function FilesSheet({ files }: FilesSheetProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function handleView(file: File): void {
    setSelectedFile(file);
    setIsModalOpen(true);
  }

  function handleDownload(file: File): void {
    // Create an anchor element and trigger download
    const link = document.createElement("a");
    link.href = file.signedUrl;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="text-sm">
            <IconFiles className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
          </Button>
        </SheetTrigger>
        <SheetContent className="pb-20">
          <SheetHeader>
            <SheetTitle className="text-left">Session Files</SheetTitle>
          </SheetHeader>

          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 mt-2 rounded-md bg-zinc-50 dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-2 pl-2">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {file.filename}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(file)}
                    >
                      <IconEye className="h-[1.2rem] w-[1.2rem] text-zinc-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(file)}
                    >
                      <IconDownload className="h-[1.2rem] w-[1.2rem] text-zinc-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 text-center">
              No files uploaded
            </p>
          )}
        </SheetContent>
      </Sheet>

      <FileDialog
        selectedFile={selectedFile}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}
