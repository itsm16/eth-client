import { create } from "zustand";

type ModalStore = {
    modalState : boolean,
    setModalState : (modalState : boolean) => void
}

const useModalStore = create<ModalStore>((set)=>({
    modalState : false,
    setModalState : (modalState : boolean) => set({modalState})
}))

export default useModalStore