import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter } from "react-router"
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { TooltipProvider } from "./ui/tooltip"
import { SidebarProvider } from "./ui/sidebar"


const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient()

  return (
    <BrowserRouter>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <SidebarProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </SidebarProvider>
          </QueryClientProvider>
        </ThemeProvider>
    </BrowserRouter>
    
  )
}

export default Providers