// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@allyson/ui/table";
import { Button } from "@allyson/ui/button";
import {
  IconChevronLeft,
  IconChevronRight,
  IconBrowser,
  IconEye,
  IconPlayerStop,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@allyson/ui/lib/utils";
import { useRouter } from "next/navigation";
import FilesSheet from "@allyson/ui/web/browser/files-sheet";
import { Card } from "@allyson/ui/card";
import { useUser } from "@allyson/context";


interface Session {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  customerCost: number;
}

interface SessionsTableProps {
  activeTab: string;
  statusFilter: string;
  searchTerm: string;
}

export function SessionsTable({
  activeTab,
  statusFilter = "all",
  searchTerm = "",
}: SessionsTableProps) {
  const router = useRouter();
  const { makeAuthenticatedRequest } = useUser();
  const [sessions, setSessions] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const querySessions = useCallback(async () => {
    try {
      setLoading(true);
      const status = statusFilter === "all" ? "" : statusFilter;
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/query?page=${currentPage}&limit=${itemsPerPage}&status=${status}&searchTerm=${searchTerm}&source=api`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      setSessions(data.sessions);
      setTotalPages(data.totalPages);
      setTotalSessions(data.totalSessions);
    } catch (error) {
      toast.error("Failed to fetch sessions");
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

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const status = statusFilter === "all" ? "" : statusFilter;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions?page=${currentPage}&limit=${itemsPerPage}&status=${status}&source=api`;

      const response = await makeAuthenticatedRequest(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setSessions(data.sessions || []);
      setTotalPages(data.totalPages || 1);
      setTotalSessions(data.totalSessions || 0);
    } catch (error) {
      console.error("Sessions fetch error:", error);
      toast.error(`Failed to fetch sessions: ${error.message}`);
      setSessions([]);
      setTotalPages(1);
      setTotalSessions(0);
    } finally {
      setLoading(false);
    }
  }, [
    makeAuthenticatedRequest,
    currentPage,
    statusFilter,
    searchTerm,
    itemsPerPage,
  ]);

  useEffect(() => {
    if (activeTab === "tab-2") {
      const timer = setTimeout(() => {
        setIsSearching(true);
        querySessions();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, querySessions]);

  useEffect(() => {
    if (activeTab === "tab-2") {
      fetchSessions();
    }
  }, [currentPage]);

  if (!sessions?.length) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center mt-4">
        <div className="rounded-full bg-muted p-4 mb-4">
          <IconBrowser className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Sessions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          No sessions found. Sessions will appear here when your API is used.
        </p>
      </Card>
    );
  }
  return (
    <div className="flex flex-col md:flex-row md:h-full hide-scrollbar h-screen mt-2">
      <main className="flex-1 flex overflow-hidden">
        <div className="w-full flex flex-col z-30 overflow-hidden hide-scrollbar">
          <div className="w-full h-full relative">
            <div className={`h-full overflow-auto hide-scrollbar`}>
              <div className="w-full hide-scrollbar">
                <div className="flex-1 overflow-y-auto hide-scrollbar">
                  {!sessions || sessions.length === 0 ? (
                    <Card className="p-6 h-full mt-4 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="rounded-full bg-zinc-800/50 p-4 h-24 w-24 flex items-center justify-center">
                          <IconBrowser className="w-10 h-10 text-zinc-500" />
                        </div>
                        <p className="text-sm mt-4 text-zinc-500">
                          Sessions that you create via the API will appear here.
                        </p>
                      </div>
                    </Card>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Activity</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.map((session) => (
                          <TableRow key={session.sessionId}>
                            <TableCell>
                              <code className="rounded bg-muted px-2 py-1">
                                {session.sessionId}
                              </code>
                            </TableCell>
                            <TableCell>{session.name}</TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                  {
                                    "bg-[#254E30] text-[#4A9E62]":
                                      session.status === "active",
                                    "bg-[#605929] text-[#bbb85f]":
                                      session.status === "humanInput",
                                    "bg-[#1F3843] text-[#4A849E]":
                                      session.status === "completed",
                                    "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400":
                                      session.status === "inactive" ||
                                      session.status === "failed",
                                  }
                                )}
                              >
                                {session.status === "completed"
                                  ? "Completed"
                                  : session.status === "humanInput"
                                    ? "Help Needed"
                                    : session.status === "active"
                                      ? "Active"
                                      : session.status === "inactive"
                                        ? "Inactive"
                                        : "Failed"}
                              </span>
                            </TableCell>
                            <TableCell>
                              ${session?.cost ? session.cost.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) : "0.00"}
                            </TableCell>
                            <TableCell>
                              {formatDistanceToNow(
                                new Date(session.startTime),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </TableCell>
                            <TableCell>
                              {formatDistanceToNow(
                                new Date(session.updatedAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </TableCell>
                            <TableCell className="text-right gap-2">
                              {session?.files?.length > 0 && (
                                <FilesSheet files={session.files} />
                              )}
                              <Button
                                className="ml-2"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  router.push(
                                    `/sessions/session?id=${session.sessionId}`
                                  )
                                }
                              >
                                <IconEye className="h-4 w-4 text-zinc-400" />
                              </Button>
                              {(session.status === "active" ||
                                session.status === "humanInput" ||
                                session.status === "paused") && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="ml-2"
                                  >
                                    <IconPlayerStop className="h-4 w-4 text-red-500" />
                                  </Button>
                                )}
                            </TableCell>
                          </TableRow>
                        ))}
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
  );
}
