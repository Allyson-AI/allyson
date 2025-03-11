import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Add interface for UserContextType
interface UserContextType {
  user: any; // Consider creating a proper User type
  loading: boolean;
  userId: string | null | undefined;
  token: string | null;
  getToken: () => Promise<string | null>;
  makeAuthenticatedRequest: (
    url: string,
    options?: RequestInit
  ) => Promise<Response>;
  refreshUser: () => Promise<void>;
  fetchLatestUserData: () => Promise<any>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Update the interface for fetchUser parameters
interface FetchUserParams {
  userId: string | null;
  getToken: () => Promise<string | null>;
  toast: typeof toast; // Update to use the correct toast type
}

const fetchUser = async ({ userId, getToken, toast }: FetchUserParams) => {
  const fetchWithToken = async (token: string) => {
    const response = await fetch(`${API_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    return response.json();
  };

  try {
    let token = await getToken();
    try {
      const data = await fetchWithToken(token);
      return { ...data, token };
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Unauthorized") {
        // If unauthorized, try to get a fresh token and retry
        token = await getToken();
        const data = await fetchWithToken(token);
        return { ...data, token };
      }
      throw error;
    }
  } catch (error: unknown) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Add type for UserProvider props
interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const router = useRouter();
  const { userId, getToken, isLoaded } = useAuth();
  const pathname = usePathname();
  const [isRouteReady, setIsRouteReady] = useState(false);

  const queryFn = useCallback(async () => {
    const token = await getToken();
    if (token === null) {
      throw new Error("Failed to retrieve token");
    }
    return fetchUser({ 
      userId: userId ?? null, 
      getToken: () => Promise.resolve(token), 
      toast 
    });
  }, [userId, getToken, toast]);
  const queryKey = useMemo(() => ["user", userId], [userId]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey,
    queryFn,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  const refreshUser = useCallback(async () => {
    try {
      await refetch();
    } catch (error: unknown) {
      console.error("Error refreshing user data:", error);
      toast.error("Failed to refresh data. Please check your internet connection and try again.");
    }
  }, [refetch, toast]);

  const makeAuthenticatedRequest = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const fetchWithToken = async (token: string) => {
        let headers = new Headers(options.headers || {});
        headers.set("Authorization", `Bearer ${token}`);

        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        return response;
      };

      try {
        let token = await getToken();
        if (!token) {
          throw new Error("Failed to retrieve token");
        }
        let response = await fetchWithToken(token);
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.message === "Unauthorized") {
          // If unauthorized, try to get a fresh token and retry
          const newToken = await getToken();
          if (!newToken) {
            throw new Error("Failed to retrieve new token");
          }
          const response = await fetchWithToken(newToken);
          return response;
        }
        throw error;
      }
    },
    [getToken, userId]
  );

  const fetchLatestUserData = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch latest user data");
      }

      const data = await response.json();
      return data.user;
    } catch (error: unknown) {
      console.error("Error fetching latest user data:", error);
      throw error;
    }
  }, [getToken, userId]);

  useEffect(() => {
    if (userId) {
      refetch();
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId, refetch]);

  // Not logged in, redirect to home
  useEffect(() => {
    const isProtectedRoute = pathname.startsWith('/api-console') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/sessions');

    if (isLoaded && !userId && isProtectedRoute) {
      router.push("/");
    }
  }, [userId, isLoaded, router, pathname]);

  const user = data?.user || null;
  const token = data?.token || null;

  return (
    <UserContext.Provider
      value={{
        user,
        loading: isLoading,
        userId,
        token,
        getToken,
        makeAuthenticatedRequest,
        refreshUser,
        fetchLatestUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };