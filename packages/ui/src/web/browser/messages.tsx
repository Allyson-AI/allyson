// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Card, CardDescription, CardTitle } from "@allyson/ui/card";
import { Button } from "@allyson/ui/button";
import {
  IconDownload,
  IconEye,
  IconArrowDown,
  IconBrain,
  IconTestPipe,
  IconTargetArrow,
  IconTools,
  IconCheck,
  IconArrowUp,
  IconLoader2,
  IconTrash,
  IconThumbUp,
  IconThumbDown,
  IconThumbUpFilled,
  IconThumbDownFilled,
} from "@tabler/icons-react";
import FileDialog from "@allyson/ui/web/browser/file-dialog";
import { Input } from "@allyson/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@allyson/ui/lib/utils";
import ReactMarkdown from "react-markdown";
import components from "@allyson/ui/mdx-components";
import { Separator } from "@allyson/ui/separator";

export default function Messages({
  messages,
  files,
  makeAuthenticatedRequest,
  sessionId,
  responseQuality,
  updateResponseQuality,
  sessionStatus,
}) {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [prevMessageCount, setPrevMessageCount] = useState(
    messages?.length || 0
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Only scroll to bottom when new messages are added
  useEffect(() => {
    const currentMessageCount = messages?.length || 0;
    if (currentMessageCount > prevMessageCount) {
      scrollToBottom();
    }
    setPrevMessageCount(currentMessageCount);
  }, [messages, scrollToBottom, prevMessageCount]);

  // Handle scroll events to show/hide scroll button
  const handleScroll = useCallback((e) => {
    const container = e.target;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollButton(distanceFromBottom > 200);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Initial check
      handleScroll({ target: container });
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleInputChange = (messageIndex, inputTitle, value) => {
    setInputValues((prev) => {
      // Get existing inputs for this message or use the initial structure
      const existingInputs =
        prev[messageIndex] ||
        messages[messageIndex].human_input.map((input) => ({
          ...input,
          value: "",
        }));

      // Update the specific input while preserving others
      return {
        ...prev,
        [messageIndex]: existingInputs.map((input) => {
          if (input.title === inputTitle) {
            return {
              ...input,
              value: value,
            };
          }
          return input;
        }),
      };
    });
  };

  async function handleSend(messageIndex, inputRequests) {
    if (
      sessionStatus === "completed" ||
      sessionStatus === "failed" ||
      sessionStatus === "stopped"
    ) {
      toast.error("Session is already ended. Please start a new one.");
      return;
    }
    const messageInputs = inputValues[messageIndex];

    // Create the updated message structure with values
    const updatedInputRequests = inputRequests.map((request) => {
      const matchingInput = messageInputs.find(
        (input) => input.title === request.title
      );
      return {
        ...request,
        value: matchingInput?.value || "",
      };
    });
    if (!updatedInputRequests) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/${sessionId}/update-human-input`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            humanInputResponse: updatedInputRequests,
            messageIndex: messageIndex,
          }),
        }
      );
      await response.json();

      toast.success("Responses saved successfully");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to save responses. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  // Modify the useEffect for initializing input values
  useEffect(() => {
    if (messages?.length > 0) {
      const initialInputValues = {};
      messages.forEach((message, index) => {
        if (message.human_input) {
          // Only initialize values if they don't already exist or if they have server-side values
          if (!inputValues[index]) {
            initialInputValues[index] = message.human_input.map((input) => ({
              ...input,
              value: input.value || "", // Use existing value if present
            }));
          } else {
            // Preserve existing input values while adding any new fields
            initialInputValues[index] = message.human_input.map((input) => {
              const existingInput = inputValues[index].find(
                (item) => item.title === input.title
              );
              return {
                ...input,
                value: input.value || existingInput?.value || "",
              };
            });
          }
        }
      });

      // Merge with existing values instead of replacing them
      setInputValues((prev) => ({
        ...prev,
        ...initialInputValues,
      }));
    }
  }, [messages]); // Keep messages as the only dependency

  return (
    <div
      className={cn(
        "flex flex-col h-[200px] pb-20 md:pb-0  md:h-full relative"
        // messages?.length === 0 ? "h-[140px]" : "h-[250px]"
      )}
    >
      <div
        ref={containerRef}
        className="flex flex-col overflow-y-auto relative hide-scrollbar px-4 pb-4"
        onScroll={handleScroll}
      >
        {messages?.length > 0 ? (
          messages.map((message, i) => {
            const assistantStep =
              messages.slice(0, i).filter((msg) => msg.role === "assistant")
                .length + 1;

            return message.role === "user" ? (
              <Card key={i} className="mt-4 p-4 ml-auto">
                <p className="text-sm text-left text-zinc-200">
                  {message.content}
                </p>
              </Card>
            ) : (
              <div key={i} className="mt-2">
                <div className="flex flex-row items-center gap-2 justify-center mb-2">
                  <Separator className="flex-1 my-4" />
                  <p className="text-sm text-zinc-400">
                    {message?.agent_data?.action[0]?.done
                      ? "Task Completed"
                      : `Step ${assistantStep}`}
                  </p>
                  <Separator className="flex-1 my-4" />
                </div>
                {message?.human_input && (
                  <Card className="p-4 mb-2">
                    <div className="space-y-4">
                      {Array.isArray(message.human_input) &&
                        message.human_input.map((input, inputIndex) => (
                          <div key={inputIndex} className="space-y-2">
                            <CardTitle className="text-sm text-zinc-200">
                              {input.title || ""}
                            </CardTitle>
                            <CardDescription className="text-xs text-zinc-400">
                              {input.description || ""}
                            </CardDescription>
                            <Input
                              value={
                                inputValues[i]?.find(
                                  (item) => item.title === input.title
                                )?.value || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  i,
                                  input.title,
                                  e.target.value
                                )
                              }
                              placeholder={input.title || ""}
                              className="bg-zinc-900 border-zinc-800"
                              readOnly={!!input.value}
                            />
                          </div>
                        ))}
                      {Array.isArray(message.human_input) &&
                        !message.human_input.some((input) => !!input.value) && (
                          <Button
                            className="ml-auto w-full h-8 px-3 text-sm"
                            variant="outline"
                            onClick={() => handleSend(i, message.human_input)}
                            disabled={isSending}
                          >
                            {isSending ? (
                              <>
                                <IconLoader2 className="h-[1.2rem] w-[1.2rem] animate-spin mr-2" />
                                Sending...
                              </>
                            ) : (
                              <>Submit</>
                            )}
                            <span className="sr-only">Send</span>
                          </Button>
                        )}
                    </div>
                  </Card>
                )}
                {!message?.agent_data?.action[0]?.done && message?.content && (
                  <div className="flex flex-row items-start gap-2">
                    <Image
                      src="/allyson-a.svg"
                      width={20}
                      height={20}
                      alt="Allyson"
                      className="mt-2"
                      style={{ verticalAlign: "top" }}
                    />
                    <Card key={i} className="p-4 w-full">
                      <p className="text-sm text-left text-zinc-200">
                        {message.content}
                      </p>
                    </Card>
                  </div>
                )}

                {/* Actions Card */}
                {message?.agent_data?.action?.map((actionItem, index) => (
                  <div key={index}>
                    {/* File Actions */}
                    {actionItem.save_to_file && (
                      <Card className="p-2 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-200 truncate max-w-[180px]">
                            {actionItem.save_to_file.file_path ||
                              actionItem.save_to_file.filename ||
                              ""}
                          </span>
                          {actionItem.save_to_file.status !== "deleted" ? (
                            <div className="flex">
                              <Button
                                className="p-2 bg-background hover:bg-background"
                                onClick={() => {
                                  const file = files.find(
                                    (f) =>
                                      f.filename ===
                                      actionItem.save_to_file.file_path
                                  );
                                  if (file) {
                                    setSelectedFile(file);
                                    setIsModalOpen(true);
                                  }
                                }}
                              >
                                <IconEye className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const file = files.find(
                                    (f) =>
                                      f.filename ===
                                      actionItem.save_to_file.filename
                                  );
                                  if (file?.signedUrl) {
                                    window.open(file.signedUrl, "_blank");
                                  }
                                }}
                              >
                                <IconDownload className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex p-2">
                              <IconTrash className="h-[1.2rem] w-[1.2rem] text-red-400" />
                            </div>
                          )}
                        </div>
                      </Card>
                    )}
                    {/* Completed Task Card */}
                    {actionItem.done && (
                      <div className="flex flex-row items-start gap-2 mt-4">
                        <Image
                          src="/allyson-a.svg"
                          width={20}
                          height={20}
                          alt="Allyson"
                          className="mt-2"
                          style={{ verticalAlign: "top" }}
                        />
                        <Card className="p-4 w-full ">
                          <CardDescription className="text-sm text-zinc-200">
                            <ReactMarkdown components={components}>
                              {typeof actionItem.done === "string"
                                ? actionItem.done
                                : actionItem.done.text || ""}
                            </ReactMarkdown>
                          </CardDescription>
                          <div className="flex flex-row items-center gap-1 justify-end">
                            {responseQuality === "noResponse" ? (
                              // Show both buttons when no response
                              <>
                                <IconThumbUp
                                  className="h-[1.2rem] w-[1.2rem] text-zinc-400 cursor-pointer"
                                  onClick={() => updateResponseQuality("good")}
                                />
                                <IconThumbDown
                                  className="h-[1.2rem] w-[1.2rem] text-zinc-400 cursor-pointer"
                                  onClick={() => updateResponseQuality("bad")}
                                />
                              </>
                            ) : (
                              // Show filled selected button and outline unselected
                              <>
                                {responseQuality === "good" ? (
                                  <IconThumbUpFilled
                                    className="h-[1.2rem] w-[1.2rem] text-zinc-400 cursor-pointer"
                                    onClick={() =>
                                      updateResponseQuality("noResponse")
                                    }
                                  />
                                ) : (
                                  <IconThumbUp
                                    className="h-[1.2rem] w-[1.2rem] text-zinc-400 cursor-pointer"
                                    onClick={() =>
                                      updateResponseQuality("good")
                                    }
                                  />
                                )}
                                {responseQuality === "bad" ? (
                                  <IconThumbDownFilled
                                    className="h-[1.2rem] w-[1.2rem] text-zinc-400 cursor-pointer"
                                    onClick={() =>
                                      updateResponseQuality("noResponse")
                                    }
                                  />
                                ) : (
                                  <IconThumbDown
                                    className="h-[1.2rem] w-[1.2rem] text-zinc-400 cursor-pointer"
                                    onClick={() => updateResponseQuality("bad")}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <Card className="mt-4 px-4 md:py-4 py-8 ">
            <h5 className="text-sm text-center text-zinc-400">
              No messages yet...
            </h5>
          </Card>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button - moved outside scroll container */}
      {showScrollButton && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <Button
            onClick={scrollToBottom}
            className="pointer-events-auto rounded-full shadow-lg hover:shadow-xl transition-all bg-zinc-900 border border-zinc-800"
            size="icon"
            variant="secondary"
          >
            <IconArrowDown className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      )}
      <FileDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedFile={selectedFile}
      />
    </div>
  );
}
