import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "../query/queryClient";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={QueryClient}>{children}</QueryClientProvider>;
}
