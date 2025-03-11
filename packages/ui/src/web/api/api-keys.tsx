// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@allyson/context";

import { Button } from "@allyson/ui/button";
import {
  IconPlus,
  IconKey,
  IconBrowser,
  IconChartLine,
  IconSearch,
  IconBook,
  IconMenu2,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@allyson/ui/select";
import { ApiKeysTable } from "@allyson/ui/web/api/components/api-keys-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@allyson/ui/tabs";
import { SessionsTable } from "@allyson/ui/web/api/components/sessions-table";
import { Input } from "@allyson/ui/input";
import { Usage } from "@allyson/ui/web/api/components/usage";
import SidebarMenuComponent from "@allyson/ui/layout/sidebar";
import { useSidebar } from "@allyson/ui/sidebar";

export default function ApiKeys() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleSidebar } = useSidebar();
  const { user, fetchLatestUserData } = useUser();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize activeTab from URL or default to "tab-1"
  const [activeTab, setActiveTab] = useState("tab-1");

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab !== activeTab) {
      router.push(`?tab=${activeTab}`);
    }
    fetchLatestUserData();
  }, [activeTab, router, searchParams]);

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <div className="md:flex">
        <SidebarMenuComponent />
      </div>
      <main className="flex p-4 w-full">
        <div className="w-full flex flex-col">
          <Tabs
            defaultValue={activeTab}
            className="flex flex-col flex-1 w-full"
            onValueChange={(value) => {
              setActiveTab(value);
              setSearchTerm("");
            }}
          >
            <div className="flex md:flex-row flex-col justify-between items-center md:mb-2">
              <div className="flex flex-row items-center justify-between w-full">
                <IconMenu2
                  className="md:hidden text-zinc-200 h-7 w-7"
                  onClick={toggleSidebar}
                />
                <div className="flex flex-row overflow-x-auto hide-scrollbar">
                  <TabsList className="h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
                    <TabsTrigger
                      value="tab-1"
                      className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                      <IconKey
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      API Keys
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab-2"
                      className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                      <IconBrowser
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      Sessions
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab-3"
                      className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                    >
                      <IconChartLine
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      Usage
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              {/* Desktop */}
              <div className="hidden md:flex items-center space-x-4">
                {activeTab === "tab-1" && (
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-row">
                      <div className="relative">
                        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search..."
                          className="w-full pl-8 md:w-[200px] lg:w-[336px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[100px] md:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={setCreateDialogOpen}>
                      <IconPlus className="h-[1.2rem] w-[1.2rem] mr-2" />
                      Create a New API Key
                    </Button>
                  </div>
                )}

                {activeTab === "tab-2" && (
                  <>
                    <div className="flex flex-row">
                      <div className="relative">
                        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search..."
                          className="w-full pl-8 md:w-[200px] lg:w-[336px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[100px] md:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="humanInput">Help Needed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://docs.allyson.ai", "_blank")
                      }
                    >
                      <IconBook className="h-[1.2rem] w-[1.2rem] mr-2" />
                      Documentation
                    </Button>
                  </>
                )}
              </div>
              {/* Mobile */}
              <div className="flex md:hidden w-full">
                {activeTab === "tab-1" && (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row mt-4 gap-2 w-full">
                      <div className="relative flex-grow">
                        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search..."
                          className="w-full pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                          setStatusFilter(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-[100px] md:w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={setCreateDialogOpen}
                      >
                        <IconPlus className="h-[1.2rem] w-[1.2rem]" />
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "tab-2" && (
                  <div className="mt-4 gap-2 flex flex-row w-full">
                    <div className="relative flex-grow">
                      <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://docs.allyson.ai", "_blank")
                      }
                    >
                      <IconBook className="h-[1.2rem] w-[1.2rem] mr-2" />
                      Documentation
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <TabsContent value="tab-1">
              <ApiKeysTable
                activeTab={activeTab}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                createDialogOpen={createDialogOpen}
                setCreateDialogOpen={setCreateDialogOpen}
              />
            </TabsContent>
            <TabsContent value="tab-2">
              <SessionsTable
                activeTab={activeTab}
                statusFilter={statusFilter}
                searchTerm={searchTerm}
              />
            </TabsContent>
            <TabsContent value="tab-3" className="h-full">
              <Usage />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
