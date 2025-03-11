// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useUser } from "@allyson/context";

import { useEffect, useState } from "react";
import { PaginationComponent } from "@allyson/ui/pagination";
import { Button } from "@allyson/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export default function BillingTable() {
  const { user, makeAuthenticatedRequest } = useUser();
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [billingLogs, setBillingLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  function formatTime(timeString) {
    const time = new Date(timeString);
    return (
      time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }) +
      " - " +
      time.toLocaleDateString("en-US")
    );
  }
  async function getBillingLogs() {
    setLoading(true);
    const response = await makeAuthenticatedRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/user/billing-logs?page=${currentPage}&limit=${limit}`,
      {
        method: "GET",
      }
    );
    let result = await response.json();
    setBillingLogs(result.data);
    setTotalPages(result.totalPages);
    setLoading(false);
    return result;
  }

  async function getBillingPortal() {
    const response = await makeAuthenticatedRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/user/billing-portal`,
      {
        method: "POST",
      }
    );
    let result = await response.json();
    window.open(result.session.url, "_blank");
  }

  useEffect(() => {
    getBillingLogs();
  }, [currentPage]);

  return (
    <div className="w-full mt-2">
      <div className="mx-auto">
        <div className="flex flex-col rounded-lg">
          <div className="flex flex-row justify-between items-center mb-3">
            <h2 className="font-semibold text-xl ">Billing Logs</h2>
            <Button variant="outline" onClick={getBillingPortal}>
              Billing Portal
            </Button>
          </div>
          {/* Adjusted for mobile-friendly scrolling */}
          <div
            className="h-full overflow-y-auto py-2 pb-16 hide-scrollbar"
            style={{ maxHeight: "calc(100vh - 10rem)" }}
          >
            <table className="w-full pb-16">
              {/* Table headers and body */}
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-zinc-800 text-left text-xs leading-4 font-medium text-zinc-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 border-b-2 border-zinc-800 text-center text-xs leading-4 font-medium text-zinc-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 border-b-2 border-zinc-800 text-center text-xs leading-4 font-medium text-zinc-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 border-b-2 border-zinc-800 text-center text-xs leading-4 font-medium text-zinc-400 uppercase tracking-wider">
                    Previous Balance
                  </th>
                  <th className="px-6 py-3 border-b-2 border-zinc-800 text-center text-xs leading-4 font-medium text-zinc-400 uppercase tracking-wider">
                    New Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingLogs.map((log, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-zinc-800 text-zinc-500 text-sm">
                      {formatTime(log.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-zinc-800 text-zinc-500 text-sm text-center">
                      {log.type === "step"
                        ? log.name
                        : log.type === "subscription_payment"
                          ? "Subscription"
                          : "Balance Reload"}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-zinc-800 text-zinc-500 text-sm text-center">
                      
                      {log.type === "step"
                        ? `- ${log.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`
                        : `${log.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-zinc-800 text-zinc-500 text-sm text-center">
                      {log.previousBalance.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-zinc-800 text-zinc-500 text-sm text-center">
                      {log.newBalance.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center items-center mt-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1 || loading}
              >
                <IconChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-zinc-500">
                Page {currentPage} of {totalPages === 0 ? 1 : totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage >= totalPages || loading}
              >
                Next
                <IconChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
