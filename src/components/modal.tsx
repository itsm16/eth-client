import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "./ui/textarea"
import { Separator } from "./ui/separator"
import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery} from "@tanstack/react-query"
import useLoaderStore from "@/store/useLoaderStore"
import { toast } from 'sonner'
import { Input } from "./ui/input"
import { SelectOptions } from "./select-options"
import { createTask, getUsers } from "@/utils/query-functions"

export function Modal(props: {projectId?: string}) {
  const [description, setDescription] = useState<string>("")
  const [taskName, setTaskName] = useState<string>("")
  const { setIsLoading } = useLoaderStore(state => state)
  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ id: string, name: string }>({ id: "", name: "" })
  const { data: users } = useQuery({ queryFn: getUsers, queryKey: ['users'], refetchOnWindowFocus: false })
  const { mutate } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Task created successfully")
      closeBtn.current?.click()
    },
    onError: (error) => {
      toast.error("Failed to create task")
      console.error(error)
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  useEffect(() => {
    if (users && users?.data?.data?.length > 0) {
      setSelectedUser({ id: users.data.data[0].id, name: users.data.data[0].name })
    }
  }, [users])

  const handleSubmit = () => {
    setIsLoading(true)
    mutate({
      projectId: props.projectId!,
      title: taskName,
      description: description,
      assignedTo: selectedUser.id
    })
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">+ Create Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle>Add Task</DialogTitle>
            <Separator className="mb-3" />
            <label htmlFor="job-description">
              Task Name
              <Input type="text" placeholder="Task Name" className="mt-1 text-xs" value={taskName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskName(e.target.value)} />
            </label>
            <label htmlFor="job-description">
              Description
              <Textarea className="mt-1 text-xs h-48" placeholder="Job Description..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label htmlFor="job-description">
              Assign Task To
              <SelectOptions
                options={users?.data?.data.map((user: { id: string, name: string }) => ({ id: user.id, name: user.name })) || []}
                selectedValue={selectedUser}
                setSelectedValue={setSelectedUser}
              />
            </label>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild ref={closeBtn}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
