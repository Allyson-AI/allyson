// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { toast } from "sonner";
import { useUser } from "@allyson/context";
import { Card } from "@allyson/ui/card";
import { Button } from "@allyson/ui/button";
import { ChevronLeft } from "lucide-react";
import { BrowserChatTextarea } from "@allyson/ui/textarea";
import {
  IconMenu2,
  IconMouse,
  IconMouseFilled,
  IconPlayerStop,
} from "@tabler/icons-react";
import { Skeleton } from "@allyson/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { useInterval } from "@allyson/hooks/useInterval"; // You'll need to create this custom hook
import FilesSheet from "@allyson/ui/web/browser/files-sheet";
import FunctionsSheet from "@allyson/ui/web/browser/functions-sheet";
import Messages from "@allyson/ui/web/browser/messages";
import SettingsSheet from "@allyson/ui/web/browser/settings-sheet";
import { useSidebar } from "@allyson/ui/sidebar";
import SidebarMenuComponent from "@allyson/ui/layout/sidebar";
import { NotificationsDialog } from "@allyson/ui/web/browser/notifications-dialog";
import PricingDialog from "@allyson/ui/web/settings/pricing-dialog";
import { LoginDialog } from "@allyson/ui/web/login-dialog";
import { Textarea } from "@allyson/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@allyson/ui/tooltip";
import dynamic from 'next/dynamic'

const VncScreen = dynamic(
  () => import("react-vnc").then((mod) => mod.VncScreen),
  { ssr: false }
);

export default function BrowserClient() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const ref = useRef(null);
  const { user, makeAuthenticatedRequest } = useUser();
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [files, setFiles] = useState([]);
  const [userFiles, setUserFiles] = useState([]);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [cost, setCost] = useState(0);
  const [maxSteps, setMaxSteps] = useState(30);
  const [sessionVariables, setSessionVariables] = useState([
    { name: "", value: "" },
  ]);
  const [sessionDetails, setSessionDetails] = useState("");
  const searchParams = useSearchParams();
  const querySessionId = searchParams.get("id");

  const [sessionId, setSessionId] = useState(querySessionId || null);
  const [loading, setLoading] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("inactive");
  const [isPolling, setIsPolling] = useState(false);
  const [lastScreenshotUrl, setLastScreenshotUrl] = useState(null);
  const [responseQuality, setResponseQuality] = useState("noResponse");
  const [isVncLoading, setIsVncLoading] = useState(true);
  const [isViewOnly, setIsViewOnly] = useState(true);
  const [isControlling, setIsControlling] = useState(false);

  const [vncKey, setVncKey] = useState(0);
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [controlDialogOpen, setControlDialogOpen] = useState(false);

  const [vncPassword, setVncPassword] = useState("");

  const calculatePrice = (steps: number): number => {
    const BASE_PRICE = 0.02;
    const TIER_SIZE = 10;
    const MAX_TIER = 1000;

    // Helper function to calculate a single tier's price
    const calculateTierPrice = (
      tierSteps: number,
      multiplier: number
    ): number => {
      return tierSteps * (BASE_PRICE * multiplier);
    };

    // Calculate which tier we're in and how many steps remain in current tier
    const currentTier = Math.min(Math.ceil(steps / TIER_SIZE), MAX_TIER);
    const stepsInCurrentTier = steps - TIER_SIZE * (currentTier - 1);

    let totalPrice = 0;

    // Add up completed tiers
    for (let tier = 1; tier < currentTier; tier++) {
      totalPrice += calculateTierPrice(TIER_SIZE, tier);
    }

    // Add final tier
    totalPrice += calculateTierPrice(
      Math.min(stepsInCurrentTier, TIER_SIZE),
      currentTier
    );

    return totalPrice;
  };

  const fetchMessages = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const response = await makeAuthenticatedRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/${sessionId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setMessages(data.session?.messages || []);
        setLastScreenshotUrl(data.session.lastScreenshotUrl);
        setFiles(data.session.files);
        setSuccess(data.session.success);
        setSessionStatus(data.session.status);
        setCost(data.session.cost);
        setVncPassword(data.session.vncPassword);
        setResponseQuality(data.session.responseQuality);
        if (data.session.maxSteps) {
          setMaxSteps(data.session.maxSteps);
        }
        if (data.session.sessionVariables) {
          setSessionVariables(data.session.sessionVariables);
        }
        if (data.session.sessionDetails) {
          setSessionDetails(data.session.sessionDetails);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to fetch messages. Please try again.");
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [makeAuthenticatedRequest, sessionId]
  );

  const fetchInitialSession = useCallback(async () => {
    setLoading(true);
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/${sessionId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setSessionStatus(data.session.status);
      setMessages(data.session?.messages || []);
      setLastScreenshotUrl(data.session.lastScreenshotUrl);
      setSuccess(data.session.success);
      setFiles(data.session?.files || []);
      setCost(data.session?.cost);
      setResponseQuality(data.session.responseQuality);
      setVncPassword(data.session.vncPassword);
      if (data.session.maxSteps) {
        setMaxSteps(data.session.maxSteps);
      }
      if (data.session.sessionVariables) {
        setSessionVariables(data.session.sessionVariables);
      }
      if (data.session.sessionDetails) {
        setSessionDetails(data.session.sessionDetails);
      }
    } catch (error) {
      console.error("Error fetching initial session:", error);
      toast.error("Failed to fetch initial session. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest, sessionId]);

  const handleSendMessageUpdate = async () => {
    try {
      setIsSending(true);
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/${sessionId}/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
          }),
        }
      );
      await response.json();

      toast.success("Message sent successfully.");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
      setMessage("");
    }
  };

  // Fetch initial session when component mounts or taskId changes
  useEffect(() => {
    if (sessionId) {
      fetchInitialSession();
    }
  }, [sessionId, fetchInitialSession]);

  useInterval(
    () => {
      if (
        sessionStatus === "active" ||
        sessionStatus === "humanInput" ||
        sessionStatus === "paused"
      ) {
        fetchMessages(false);
      }
    },
    sessionStatus === "active" ||
      sessionStatus === "humanInput" ||
      sessionStatus === "paused"
      ? 1000
      : null
  );

  async function handleSend() {
    if (
      sessionStatus === "completed" ||
      sessionStatus === "stopped" ||
      sessionStatus === "failed"
    ) {
      toast.error("Session completed. Please start a new session.");
      return;
    }
    if (!message) {
      toast.error("Please enter a message.");
      return;
    }
    if (!user) {
      setLoginDialogOpen(true);
      toast.error("Please sign in to start a task.");
      return;
    }
    if (user.balance <= 0) {
      setPricingDialogOpen(true);
      toast.error(
        `Please reload your balance. You have $${user.balance.toLocaleString({ minimumFractionDigits: 2, maximumFractionDigits: 2 })} remaining.`
      );
      return;
    }

    setIsSending(true);
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: message,
            sessionVariables: sessionVariables,
            sessionDetails: sessionDetails,
            maxSteps: maxSteps,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.sessionId) {
        toast.error("Failed to start task. Please try again.");
      }

      setSessionId(data.sessionId);
      router.push(`/sessions/session?id=${data.sessionId}`);
      setIsSent(true);
      setIsPolling(true);
      toast.success("Session started successfully.");
    } catch (error) {
      console.error("Error starting task:", error);
      toast.error(`Failed to start task: ${error.message}`);
    } finally {
      setIsSending(false);
      setMessage("");
    }
  }

  async function handleStop() {
    setIsSending(true);
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/${sessionId}/stop`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      fetchMessages();
      toast.success("Session stopped successfully.");
    } catch (error) {
      console.error("Error stopping task:", error);
      toast.error("Failed to stop task. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  async function updateResponseQuality(quality) {
    setResponseQuality(quality);
    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/${sessionId}/update-response-quality`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            responseQuality: quality,
          }),
        }
      );
      await response.json();

      toast.success("Response quality updated successfully");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update response quality. Please try again.");
    }
  }

  async function takeControl() {
    try {
      setIsControlling(true);
      setIsViewOnly(false);
      setVncKey((prev) => prev + 1); // Force VNC refresh
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/${sessionId}/pause`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("You now have control of the browser.");
    } catch (error) {
      console.error("Error taking control:", error);
      toast.error("Failed to take control. Please try again.");
      setIsControlling(false);
      setIsViewOnly(true);
    }
  }

  async function releaseControl() {
    try {
      setIsControlling(false);
      setIsViewOnly(true);
      setVncKey((prev) => prev - 1); // Force VNC refresh
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/${sessionId}/resume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: updateMessage,
          }),
        }
      );
      toast.success("You have given control back to Allyson.");
      setControlDialogOpen(false);
      setUpdatedMessage("");
    } catch (error) {
      console.error("Error taking control:", error);
      toast.error("Failed to take control. Please try again.");
      setIsControlling(false);
      setIsViewOnly(true);
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleRemoveFile = (file) => {
    setUserFiles(userFiles.filter((f) => f.name !== file.name));
  };

  const LoadingUI = () => {
    if (lastScreenshotUrl) {
      return (
        <img
          src={lastScreenshotUrl}
          alt="Browser Screenshot"
          className="w-full h-full object-contain"
        />
      );
    } else {
      return (
        <div className="absolute inset-0 flex items-center justify-center rounded-md mb-4">
          <Skeleton className="absolute inset-0 z-10 rounded-md" />
        </div>
      );
    }
  };

  const connectVnc = useCallback(() => {
    if (
      ref.current &
      (sessionStatus === "active" ||
        sessionStatus === "humanInput" ||
        sessionStatus === "paused")
    ) {
      setIsVncLoading(true);
      ref.current.connect();
      console.log("VNC connection initiated");
    }
    if (sessionStatus === "paused") {
      setIsControlling(true);
    }
  }, [sessionStatus]);

  useEffect(() => {
    connectVnc();
  }, [sessionStatus]);

  return (
    <div className="flex flex-col md:flex-row md:h-full hide-scrollbar h-screen overflow-y-auto hide-scrollbar">
      <div className="md:flex">
        <SidebarMenuComponent />
      </div>

      {/* Desktop Messages */}
      <div className="md:relative md:w-1/3 hidden h-full md:flex flex-col border-r border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            <Messages
              messages={messages}
              files={files}
              makeAuthenticatedRequest={makeAuthenticatedRequest}
              sessionId={sessionId}
              responseQuality={responseQuality}
              updateResponseQuality={updateResponseQuality}
              sessionStatus={sessionStatus}
            />
          </div>

          <div className="px-4 pb-4 min-h-[100px]">
            <BrowserChatTextarea
              id="step-1"
              onSend={sessionId ? handleSendMessageUpdate : handleSend}
              value={message}
              onChange={handleChange}
              files={userFiles}
              setFiles={setUserFiles}
              onRemoveFile={handleRemoveFile}
              isSending={isSending}
              isSent={isSent}
            />
          </div>
        </div>
      </div>
      {/* Desktop Browser */}
      <main className="hidden md:flex p-4 w-full flex-col">
        <Card className="w-full h-[300px] md:h-full p-4 flex flex-col z-30 relative overflow-y-auto hide-scrollbar">
          {/* Controls */}
          <div className="flex flex-row justify-between mb-4">
            <div className="flex flex-row items-center gap-2">
              {sessionId && (
                <Button
                  onClick={() => {
                    router.back();
                  }}
                  variant="outline"
                  size="outline"
                  className="p-2"
                >
                  <ChevronLeft className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              )}
            </div>

            <div className="flex flex-row items-center gap-2">
              <p className="text-sm text-zinc-500">${cost.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    sessionStatus === "active"
                      ? "bg-green-500"
                      : sessionStatus === "completed"
                        ? "bg-blue-500"
                        : sessionStatus === "humanInput"
                          ? "bg-yellow-500"
                          : sessionStatus === "paused"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-zinc-500 mr-2">
                  {sessionStatus === "active"
                    ? "Active"
                    : sessionStatus === "completed"
                      ? "Completed"
                      : sessionStatus === "humanInput"
                        ? "Help Needed"
                        : sessionStatus === "failed"
                          ? "Failed"
                          : sessionStatus === "stopped"
                            ? "Stopped"
                            : sessionStatus === "paused"
                              ? "Paused"
                              : "Inactive"}
                </span>
              </div>
              {(sessionStatus === "active" ||
                sessionStatus === "humanInput" ||
                sessionStatus === "paused") && (
                <>
                  <Button
                    onClick={handleStop}
                    variant="outline"
                    size="outline"
                    className="p-2 hover:bg-red-400/20 hover:border-red-400/20"
                  >
                    <IconPlayerStop className="h-[1.2rem] w-[1.2rem] text-red-400" />
                  </Button>
                  {lastScreenshotUrl && (
                    // <TooltipProvider>
                    //   <Tooltip>
                    //     <TooltipTrigger asChild>
                    //       <Button
                    //         variant="outline"
                    //         size="icon"
                    //         onClick={() => {
                    //           !isControlling
                    //             ? takeControl()
                    //             : setControlDialogOpen(true);
                    //         }}
                    //       >
                    //         {!isControlling ? (
                    //           <IconMouse className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                    //         ) : (
                    //           <IconMouseFilled className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                    //         )}
                    //       </Button>
                    //     </TooltipTrigger>
                    //     <TooltipContent side="bottom">
                    //       {!isControlling ? "Take Control" : "Release Control"}
                    //     </TooltipContent>
                    //   </Tooltip>
                    // </TooltipProvider>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        !isControlling
                          ? takeControl()
                          : setControlDialogOpen(true);
                      }}
                    >
                      {!isControlling ? (
                        <IconMouse className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                      ) : (
                        <IconMouseFilled className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
                      )}
                    </Button>
                  )}
                </>
              )}
              {files.length > 0 && <FilesSheet files={files} />}
              <FunctionsSheet />
              <SettingsSheet
                sessionStatus={sessionStatus}
                maxSteps={maxSteps}
                setMaxSteps={setMaxSteps}
                sessionVariables={sessionVariables}
                setSessionVariables={setSessionVariables}
                sessionDetails={sessionDetails}
                setSessionDetails={setSessionDetails}
              />
            </div>
          </div>
          <div className="flex-grow pb-4 h-full relative">
            {!lastScreenshotUrl ? (
              <Card className="w-full h-full flex items-center justify-center">
                <h1 className="text-sm md:text-xl text-zinc-400">
                  {sessionStatus === "active"
                    ? "Browser loading..."
                    : "Ask me to start a task for you."}
                </h1>
              </Card>
            ) : (
              <>
                {sessionStatus === "active" ||
                sessionStatus === "humanInput" ||
                sessionStatus === "paused" ? (
                  <div className="relative w-full h-full max-w-[75vw]">
                    <VncScreen
                      key={vncKey}
                      url={
                        process.env.NODE_ENV === "production"
                          ? `wss://${sessionId}.browser.allyson.ai`
                          : `wss://${sessionId}.dev-browser.allyson.ai`
                      }
                      rfbOptions={{ credentials: { password: vncPassword } }}
                      scaleViewport
                      background="transparent"
                      viewOnly={isViewOnly}
                      className="w-full h-full object-contain"
                      ref={ref}
                      loadingUI={isVncLoading && <LoadingUI />}
                      onConnect={() => {
                        console.log("VNC connected");
                        setIsVncLoading(false);
                      }}
                      onDisconnect={() => {
                        console.log("VNC disconnected. Retrying...");
                        setIsViewOnly(true);
                      }}
                      onConnectFailure={() => {
                        console.log(
                          "Failed to connect VNC. Retrying in 1 seconds..."
                        );
                        setIsViewOnly(true);
                      }}
                    />
                    {controlDialogOpen && (
                      <>
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        {/* Bottom-aligned Card overlay */}
                        <Card className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md backdrop-blur-sm p-4 space-y-2 shadow-lg">
                          <p className="text-sm text-zinc-200">
                            Let Allyson know what you just did so she knows
                            where to leave off from.
                          </p>
                          <Textarea
                            className="w-full p-2 text-sm border rounded-md"
                            rows={2}
                            placeholder=""
                            onChange={(e) => setUpdateMessage(e.target.value)}
                          />
                          <Button
                            onClick={releaseControl}
                            className="w-full"
                            variant="outline"
                          >
                            Submit
                          </Button>
                        </Card>
                      </>
                    )}
                  </div>
                ) : (
                  <img
                    src={lastScreenshotUrl}
                    alt="Browser Screenshot"
                    className="w-full h-full object-contain"
                  />
                )}
              </>
            )}
          </div>
        </Card>
      </main>

      {/* Mobile Browser */}
      <main className="md:hidden p-4 w-full flex flex-col">
        {/* Controls */}
        <div className="flex flex-row justify-between mb-4">
          <IconMenu2
            className="text-zinc-200 h-7 w-7"
            onClick={toggleSidebar}
          />

          <div className="flex flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  sessionStatus === "active"
                    ? "bg-green-500"
                    : sessionStatus === "completed"
                      ? "bg-blue-500"
                      : sessionStatus === "humanInput"
                        ? "bg-yellow-500"
                        : sessionStatus === "paused"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                }`}
              />
              <span className="text-sm text-zinc-500 mr-2">
                {sessionStatus === "active"
                  ? "Active"
                  : sessionStatus === "completed"
                    ? "Completed"
                    : sessionStatus === "humanInput"
                      ? "Help Needed"
                      : sessionStatus === "stopped"
                        ? "Stopped"
                        : sessionStatus === "paused"
                          ? "Paused"
                          : "Inactive"}
              </span>
            </div>
            {(sessionStatus === "active" ||
              sessionStatus === "humanInput" ||
              sessionStatus === "paused") && (
              <Button
                onClick={handleStop}
                variant="outline"
                size="outline"
                className="p-2 hover:bg-red-400/20 hover:border-red-400/20"
              >
                <IconPlayerStop className="h-[1.2rem] w-[1.2rem] text-red-400" />
              </Button>
            )}
            <FilesSheet files={files} />
            <FunctionsSheet />
            <SettingsSheet
              maxSteps={maxSteps}
              setMaxSteps={setMaxSteps}
              sessionVariables={sessionVariables}
              setSessionVariables={setSessionVariables}
              sessionDetails={sessionDetails}
              setSessionDetails={setSessionDetails}
            />
          </div>
        </div>

        <div className="w-full h-[300px] md:h-full flex flex-col z-30 relative overflow-y-auto hide-scrollbar">
          <div className="flex-grow h-full relative">
            {!lastScreenshotUrl ? (
              <Card className="w-full h-full flex items-center justify-center">
                <h1 className="text-sm md:text-xl text-zinc-400">
                  Ask Allyson to start a task for you.
                </h1>
              </Card>
            ) : (
              <>
                <img
                  src={lastScreenshotUrl}
                  alt="Browser Screenshot"
                  className="w-full h-full object-contain"
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Messages */}
      <div className="md:hidden">
        <Messages
          messages={messages}
          files={files}
          makeAuthenticatedRequest={makeAuthenticatedRequest}
          sessionId={sessionId}
          sessionStatus={sessionStatus}
        />

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <BrowserChatTextarea
            onSend={sessionId ? handleSendMessageUpdate : handleSend}
            value={message}
            onChange={handleChange}
            files={userFiles}
            setFiles={setUserFiles}
            onRemoveFile={handleRemoveFile}
            isSending={isSending}
            isSent={isSent}
          />
        </div>
      </div>
      <NotificationsDialog open={false} />
      <PricingDialog
        open={pricingDialogOpen}
        onOpenChange={setPricingDialogOpen}
      />
      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </div>
  );
}
