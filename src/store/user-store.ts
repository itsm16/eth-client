import {create} from 'zustand'

type UserStore = {
    user: {id:number, email: string} | null,
    setUser: (user : object) => void
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user: any) => set({user})
}))

export default useUserStore