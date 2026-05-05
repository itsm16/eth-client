import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "./ui/textarea"
import { Separator } from "./ui/separator"
import { useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useLoaderStore from "@/store/useLoaderStore"
import {toast} from 'sonner'
import { Input } from "./ui/input"

export function Modal() {
  const [description, setDescription] = useState<string>("")
  const [taskName, setTaskName] = useState<string>("")
  const { setIsLoading } = useLoaderStore(state => state)
  const closeBtn = useRef<HTMLButtonElement | null>(null);

  const handleSubmit = () => {
    
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">+ Create Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <Separator className="mb-3"/>
            <label htmlFor="job-description">
              Task Name
              <Input type="text" placeholder="Task Name" className="mt-1 text-xs" value={taskName} onChange={(e : React.ChangeEvent<HTMLInputElement>) => setTaskName(e.target.value)}/>
            </label>
            <label htmlFor="job-description">
              Description
            <Textarea className="mt-1 text-xs h-48" placeholder="Job Description..." value={description} onChange={(e) => setDescription(e.target.value)}/>
            </label>
            {/* <label htmlFor="company">
              Company
              <Input type="text" placeholder="Company" className="mt-1 text-xs"/>
            </label>
            <label htmlFor="role">
              Role
              <Input type="text" placeholder="Role" className="mt-1 text-xs"/>
            </label> */}
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild ref={closeBtn}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>Parse</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
