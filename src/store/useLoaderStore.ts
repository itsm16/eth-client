
import { create } from "zustand"

type LoaderState = {
  isLoading: boolean,
  text?: string,
  setIsLoading: (isLoading: boolean, text?: string) => void
}

const useLoaderStore = create<LoaderState>((set) => ({
  isLoading: false,
  text: "Loading...",
  setIsLoading: (isLoading: boolean, text?: string) => set({ isLoading, text }),
}))

export default useLoaderStore