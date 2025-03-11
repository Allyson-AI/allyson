// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";

import { cn } from "@allyson/ui/lib/utils";
import { Button } from "@allyson/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  IconPaperclip,
  IconLoader2,
  IconFile,
  IconUsers,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import { Input } from "@allyson/ui/input";

import { Switch } from "@allyson/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@allyson/ui/tooltip";
import Link from "next/link";
import { toast } from "sonner";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

const BrowserChatTextarea = React.forwardRef(
  (
    {
      className,
      onSend,
      value,
      onChange,
      files,
      setFiles,
      onRemoveFile,
      isSending,
      isSent,
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to auto first to get the correct scrollHeight
      textarea.style.height = "auto";

      // Set to scrollHeight, but cap at 384px
      textarea.style.height = `${Math.min(textarea.scrollHeight, 384)}px`;
    }, []);

    const handleAttach = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        onAttach(files);
      };
      input.click();
    };

    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const handleCopy = () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      };

      const handleInput = () => {
        requestAnimationFrame(adjustHeight);
      };

      textarea.addEventListener("input", handleInput);
      textarea.addEventListener("paste", handleInput);
      textarea.addEventListener("copy", handleCopy);

      // Initial height adjustment with a small delay
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(adjustHeight);
      }, 0);

      return () => {
        textarea.removeEventListener("input", handleInput);
        textarea.removeEventListener("paste", handleInput);
        textarea.removeEventListener("copy", handleCopy);
        clearTimeout(timeoutId);
      };
    }, [adjustHeight]);

    // Adjust height when value prop changes
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(adjustHeight);
      }, 0);

      return () => clearTimeout(timeoutId);
    }, [value, adjustHeight]);

    return (
      <div className="relative z-10 grid rounded-xl bg-background border">
        {!isSent && files.length > 0 && (
          <div className="max-h-40 overflow-y-auto p-3">
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex border items-center rounded-lg p-2 text-sm"
                >
                  <IconFile className="h-[1.2rem] w-[1.2rem] mr-2" />
                  <span className="truncate max-w-[150px]">
                    {file.name || file.filename}
                  </span>
                  <button
                    onClick={() => onRemoveAttachment(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <textarea
          className={cn(
            "resize-none w-full flex-1 p-3 pb-1.5 md:text-sm text-base outline-none ring-0",
            "min-h-[42px] max-h-[384px] overflow-y-auto",
            isCopied ? "bg-zinc-600" : "bg-transparent",
            className
          )}
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          value={value}
          onChange={onChange}
          readOnly={isSent}
          {...props}
        />

        <div className="flex items-center gap-2 p-3">
          {/* <div className="">
              <Button
                variant="outline"
                size="icon"
                onClick={handleAttach}
                className="size-8 mr-3 rounded-lg hover:bg-zinc-800 focus:bg-zinc-700 focus-visible:bg-zinc-800"
              >
                <IconPaperclip className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Attach Files</span>
              </Button>
             
            </div> */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              onSend();
            }}
            className="ml-auto h-8 px-3 text-sm "
            variant="outline"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <IconLoader2 className="h-[1.2rem] w-[1.2rem] animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <ArrowUp className="h-[1.2rem] w-[1.2rem] mr-2" />
                Send
              </>
            )}
            <span className="sr-only">Send Message</span>
          </Button>
        </div>
      </div>
    );
  }
);

BrowserChatTextarea.displayName = "BrowserChatTextarea";

const ChatTextarea = React.forwardRef(
  (
    {
      className,
      onSend,
      value,
      onChange,
      files,
      setFiles,
      onRemoveFile,
      isSending,
      user,
      selectedContacts,
      setSelectedContacts,
      filteredContacts,
      setFilteredContacts,
      isProActive,
      setIsProActive,
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);
    const [search, setSearch] = useState("");
    const [contactButtonPressed, setContactButtonPressed] = useState(false);
    const searchInputRef = useRef(null);
    const inputRef = useRef(null);

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to auto first to get the correct scrollHeight
      textarea.style.height = "auto";

      // Set to scrollHeight, but cap at 384px
      textarea.style.height = `${Math.min(textarea.scrollHeight, 384)}px`;
    }, []);

    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const handleCopy = () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      };

      const handleInput = () => {
        requestAnimationFrame(adjustHeight);
      };

      textarea.addEventListener("input", handleInput);
      textarea.addEventListener("paste", handleInput);
      textarea.addEventListener("copy", handleCopy);

      // Initial height adjustment with a small delay
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(adjustHeight);
      }, 0);

      return () => {
        textarea.removeEventListener("input", handleInput);
        textarea.removeEventListener("paste", handleInput);
        textarea.removeEventListener("copy", handleCopy);
        clearTimeout(timeoutId);
      };
    }, [adjustHeight]);

    // Adjust height when value prop changes
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(adjustHeight);
      }, 0);

      return () => clearTimeout(timeoutId);
    }, [value, adjustHeight]);

    useEffect(() => {
      if (contactButtonPressed && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [contactButtonPressed]);

    useEffect(() => {
      if (search && user && Array.isArray(user.contacts)) {
        const filtered = user.contacts.filter((contact) =>
          `${contact.firstName} ${contact.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase())
        );
        setFilteredContacts(filtered);
      } else {
        setFilteredContacts([]);
      }
    }, [search, user]);

    const allowedFileTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
      "text/markdown",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    const MAX_FILE_SIZE = 2.5 * 1024 * 1024; // 2.5 MB in bytes
    const MAX_FILES = 5;

    const handleAttach = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.accept = allowedFileTypes.join(",");
      input.onchange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter((file) =>
          allowedFileTypes.includes(file.type)
        );

        if (validFiles.length + files.length > MAX_FILES) {
          toast({
            title: "Too many files",
            description: `You can only upload a maximum of ${MAX_FILES} files.`,
          });
          return;
        }

        const oversizedFiles = validFiles.filter(
          (file) => file.size > MAX_FILE_SIZE
        );
        if (oversizedFiles.length > 0) {
          toast({
            title: "File(s) too large",
            description: `Some files exceed the 2.5 MB size limit and were not added.`,
          });
        }

        const finalFiles = validFiles.filter(
          (file) => file.size <= MAX_FILE_SIZE
        );

        if (finalFiles.length !== selectedFiles.length) {
          const invalidFiles = selectedFiles.filter(
            (file) =>
              !allowedFileTypes.includes(file.type) || file.size > MAX_FILE_SIZE
          );
          if (invalidFiles.length > 0) {
            toast({
              title: "Some files were not added",
              description:
                "Only PDF, DOCX, TXT, CSV, Markdown, PNG, JPEG, and JPG files up to 2.5 MB are allowed.",
            });
          }
        }

        setFiles((prevFiles) =>
          [...prevFiles, ...finalFiles].slice(0, MAX_FILES)
        );
      };
      input.click();
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    };

    const handleContactSelect = (contact) => {
      setSelectedContacts((prev) => [...prev, contact]);
      setSearch("");
      setFilteredContacts([]);
      setContactButtonPressed(false);
      inputRef.current.focus();
    };

    const handleRemoveContact = (contactId) => {
      setSelectedContacts((prev) => prev.filter((c) => c.id !== contactId));
    };
    const [isCardVisible, setIsCardVisible] = useState(false);

    const toggleCard = () => {
      setIsCardVisible(!isCardVisible);
    };
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsCardVisible(true);
      }, 500);

      return () => clearTimeout(timer);
    }, []);
    return (
      <div className="relative w-full max-w-4xl mx-auto">
        {user?.plan === "free" && (
          <div
            className={`absolute rounded-t-xl left-0 right-0 bottom-full bg-zinc-800 transition-all duration-300 ease-in-out ${
              isCardVisible ? "translate-y-[10px]" : "translate-y-full"
            }`}
            style={{
              height: "40px",
              width: "100%",
              zIndex: 10,
            }}
          >
            <div className="px-2 pb-2 flex justify-between items-center h-full">
              <span className="text-xs text-white md:text-sm">
                Gain access to more features
              </span>
              <div className="flex flex-row items-center gap-2">
                <Link
                  href="/settings"
                  className="text-[#5a768b] text-xs font-semibold hover:text-[#6e8ca3] transition-colors"
                >
                  Upgrade to Pro
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCard}
                  className="text-white hover:bg-zinc-700 h-5 w-5"
                >
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="relative z-10 grid rounded-xl bg-background border w-full">
          {(files.length > 0 || selectedContacts.length > 0) && (
            <div className="max-h-40 overflow-y-auto p-3">
              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex border items-center rounded-lg p-2 text-sm"
                  >
                    <IconFile className="h-[1.2rem] w-[1.2rem] mr-2" />
                    <span className="truncate max-w-[150px]">
                      {file.name || file.filename}
                    </span>
                    <button
                      onClick={() => onRemoveFile(index)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {selectedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex border items-center rounded-lg p-2 text-sm"
                  >
                    <IconUserCircle className="h-[1.2rem] w-[1.2rem] mr-2" />
                    <span className="truncate max-w-[150px]">
                      {`${contact.firstName} ${contact.lastName}`}
                    </span>
                    <button
                      onClick={() => handleRemoveContact(contact.id)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contactButtonPressed && (
            <div className="p-2">
              <Input
                ref={searchInputRef}
                placeholder="Search Contacts"
                className="focus:ring-0 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {filteredContacts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="px-2 py-1 bg-background border rounded-md text-sm cursor-pointer hover:bg-zinc-800/70 hover:border-zinc-700"
                      onClick={() => handleContactSelect(contact)}
                    >
                      {`${contact.firstName} ${contact.lastName}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <textarea
            className={cn(
              "resize-none w-full flex-1 p-3 pb-1.5 text-sm outline-none ring-0",
              "min-h-[42px] max-h-[384px] overflow-y-auto",
              isCopied ? "bg-zinc-600" : "bg-transparent",
              className
            )}
            ref={(node) => {
              textareaRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
              inputRef.current = node;
            }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            {...props}
          />
          <div className="flex justify-between items-center gap-2 p-3">
            <div className="flex flex-row items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleAttach}
                className="size-8 rounded-lg hover:bg-zinc-800 focus:bg-zinc-700 focus-visible:bg-zinc-800"
              >
                <IconPaperclip className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Upload Files</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setContactButtonPressed(!contactButtonPressed)}
                className="size-8 rounded-lg hover:bg-zinc-800 focus:bg-zinc-700 focus-visible:bg-zinc-800"
              >
                <IconUsers className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Add Contact</span>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isProActive}
                        onCheckedChange={setIsProActive}
                      />
                      <p className="text-sm text-zinc-400">Pro</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-xs bg-background text-zinc-400 border border-border"
                  >
                    <p>
                      Pro search provides longer, more in-depth responses. Note:
                      It uses 2 credits instead of 1.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onSend();
                  setContactButtonPressed(false);
                }}
                className="ml-auto h-8 px-3 text-sm "
                variant="outline"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <IconLoader2 className="h-[1.2rem] w-[1.2rem] animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <ArrowUp className="h-[1.2rem] w-[1.2rem] mr-2" />
                    Send
                  </>
                )}
                <span className="sr-only">Send Message</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatTextarea.displayName = "ChatTextarea";

export { Textarea, ChatTextarea, BrowserChatTextarea };
