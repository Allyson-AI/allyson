// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@allyson/ui/card";
import { toast } from "sonner";
import { useUser } from "@allyson/context";
import useIsMobile from "@allyson/hooks/useIsMobile";
import { Button } from "@allyson/ui/button";
import {
  IconDots,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconWorld,
  IconPlus,
  IconSearch,
  IconMenu2,
} from "@tabler/icons-react";
import { Separator } from "@allyson/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@allyson/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@allyson/ui/select";
import { Input } from "@allyson/ui/input";
import SidebarMenuComponent from "@allyson/ui/layout/sidebar";
import { useSidebar } from "@allyson/ui/sidebar";

function BrowserSessionCard({ session, onDelete, makeAuthenticatedRequest }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = useCallback(() => {
    if (!isDeleting) {
      router.push(`/sessions/session?id=${session.sessionId}`);
    }
  }, [router, session.sessionId, isDeleting]);

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    onDelete(session.sessionId);

    try {
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/delete-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId: session.sessionId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      onDelete(session.sessionId, true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      className={`flex flex-col p-4 h-full ${isDeleting ? "opacity-50" : ""}`}
    >
      <div className="flex-grow cursor-pointer" onClick={handleCardClick}>
        <h3 className="text-lg font-semibold mb-2">{session.name}</h3>
        {/* <p className="text-sm text-zinc-500">{session.lastActionPreview}</p> */}
      </div>
      <Separator className="my-2 mx-1" />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 pl-1">
          <div
            className={`w-2 h-2 rounded-full ${
              session.status === "active"
                ? "bg-green-500"
                : session.status === "humanInput"
                  ? "bg-yellow-500"
                  : session.status === "completed"
                    ? "bg-blue-500"
                    : "bg-red-500"
            }`}
          />
          <span className="text-xs text-zinc-400">
            {session.status === "active"
              ? "Active"
              : session.status === "humanInput"
                ? "Help Needed"
                : session.status === "completed"
                  ? "Completed"
                  : session.status === "stopped"
                    ? "Stopped"
                    : "Inactive"}
          </span>
          <span className="text-xs text-zinc-400">-</span>
          <span className="text-xs text-zinc-400">
            $
            {session?.cost
              ? session.cost.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <IconDots className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onSelect={handleDelete}
              disabled={isDeleting}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              <span>{isDeleting ? "Deleting..." : "Delete"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

function BrowserSessionSkeleton() {
  return (
    <Card className="flex flex-col p-4 h-full animate-pulse">
      <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded mb-1"></div>
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded mb-1"></div>
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mt-2 w-1/2"></div>
    </Card>
  );
}

export default function BrowserSessions() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  const { user, userId, makeAuthenticatedRequest, getToken } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const itemsPerPage = 18;
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const querySessions = useCallback(async () => {
    try {
      setLoading(true);
      const status = statusFilter === "all" ? "" : statusFilter;
      const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions/query?page=${currentPage}&limit=${itemsPerPage}&status=${status}&searchTerm=${searchTerm}&source=client`,
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
      const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/sessions?page=${currentPage}&limit=${itemsPerPage}&status=${status}&source=client`;

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

  const handleDelete = useCallback((deletedSessionId, revert = false) => {
    setSessions((prevSessions) => {
      if (revert) {
        return prevSessions.some(
          (session) => session && session.id === deletedSessionId
        )
          ? prevSessions
          : [
              ...prevSessions,
              prevSessions.find(
                (session) => session && session.id === deletedSessionId
              ),
            ]
              .filter(Boolean)
              .sort(
                (a, b) =>
                  new Date(b.lastActionDate) - new Date(a.lastActionDate)
              );
      } else {
        return prevSessions.filter(
          (session) => session && session.id !== deletedSessionId
        );
      }
    });

    if (!revert) {
      toast({
        title: "Session deleted",
        description: "The browser session has been successfully deleted.",
      });
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [currentPage, statusFilter]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
    setIsSearching(true);
  };

  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        querySessions();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, querySessions, isSearching]);


  return (
    <div className="flex w-full flex-col md:flex-row md:h-full h-screen">
      <div className="md:flex">
        <SidebarMenuComponent />
      </div>
      <div className="flex flex-col flex-1 h-full">
        <main className="flex-1 flex p-4 overflow-hidden">
          <div className="w-full flex flex-col z-30 overflow-hidden">
            {/* Desktop */}
            <div className="hidden md:flex flex-row justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sessions</h2>
              <div className="flex items-center space-x-4">
                <div className="flex flex-row">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full pl-8 md:w-[200px] lg:w-[336px]"
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                    />
                  </div>
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="humanInput">Help Needed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="stopped">Stopped</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/sessions/session")}
                >
                  <IconPlus className="h-[1.2rem] w-[1.2rem] mr-2" />
                  Start A New Session
                </Button>
              </div>
            </div>
            {/* Mobile */}
            <div className="flex flex-col md:hidden">
              <div className="flex flex-row justify-between items-center mb-4">
                <IconMenu2
                  className="text-zinc-200 h-7 w-7"
                  onClick={toggleSidebar}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/sessions/session")}
                >
                  <IconPlus className="h-[1.2rem] w-[1.2rem] mr-2" />
                  Start A New Session
                </Button>
              </div>
              <div className="flex flex-row justify-between items-center mb-4 gap-4">
                <div className="relative">
                  <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-8 md:w-[200px] lg:w-[336px]"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="humanInput">Help Needed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sessions */}
            <div className="flex-1 overflow-y-auto hide-scrollbar w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  Array(15)
                    .fill()
                    .map((_, index) => <BrowserSessionSkeleton key={index} />)
                ) : sessions.length > 0 ? (
                  sessions.map((session) => (
                    <BrowserSessionCard
                      key={session?.sessionId}
                      session={session}
                      onDelete={handleDelete}
                      makeAuthenticatedRequest={makeAuthenticatedRequest}
                    />
                  ))
                ) : (
                  <Card className="flex flex-col p-4 col-span-full">
                    <div className="flex flex-col justify-center items-center">
                      <div className="flex flex-col justify-center items-center rounded-full bg-zinc-800 p-4">
                        <IconWorld className="h-8 w-8 text-zinc-400" />
                      </div>
                      <p className="text-md text-zinc-500 text-center mt-4">
                        There are no browser sessions yet.
                      </p>
                      <Button
                        variant="outline"
                        className="w-fit mt-4"
                        onClick={() => router.push("/sessions/session")}
                      >
                        Start a new session
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center mt-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
        </main>
      </div>
    </div>
  );
}
