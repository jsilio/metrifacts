import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(error.message, {
          action: {
            label: "retry",
            onClick: () => {
              getQueryClient().invalidateQueries();
            },
          },
        });
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // Server: always make a new query client
  if (isServer) {
    return makeQueryClient();
  }

  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
