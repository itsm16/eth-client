import { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { SelectOptions } from "../select-options"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { getAllProjects, createProject, deleteProject, getUsers, assignMember, removeMember, getProjectMembers } from "@/utils/query-functions"
import useLoaderStore from "@/store/useLoaderStore"

export const AdminPanel = () => {
  const [selectedProject, setSelectedProject] = useState({id: "", name: ""})
  const [selectedMember, setSelectedMember] = useState({id: "", name: ""})
  const [projectName, setProjectName] = useState("")
  
  const queryClient = useQueryClient()

  const {setIsLoading} = useLoaderStore()
  
  const { data: projects, isLoading: projectsLoading } = useQuery({ 
    queryFn: getAllProjects, 
    queryKey: ['allProjects'],
    refetchOnWindowFocus: false 
  })
  
  const { data: users, isLoading: usersLoading } = useQuery({ 
    queryFn: getUsers, 
    queryKey: ['users'],
    refetchOnWindowFocus: false 
  })
  
  const { data: projectMembers, isLoading: projectLoading } = useQuery({ 
    queryFn: getProjectMembers, 
    queryKey: ['projectMembers'],
    refetchOnWindowFocus: false 
  })
  
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created successfully")
      queryClient.invalidateQueries({ queryKey: ['allProjects'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setProjectName("")
    },
    onError: () => toast.error("Failed to create project")
  })
  
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['allProjects'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: () => toast.error("Failed to delete project")
  })
  
  const assignMemberMutation = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: number }) => 
      assignMember(projectId, userId),
    onSuccess: () => {
      toast.success("Member assigned successfully")
      queryClient.invalidateQueries({ queryKey: ['allProjects'] })
      queryClient.invalidateQueries({ queryKey: ['projectMembers'] })
      setSelectedProject({id: "", name: ""})
      setSelectedMember({id: "", name: ""})
    },
    onError: () => toast.error("Failed to assign member")
  })
  
  const removeMemberMutation = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) => 
      removeMember(projectId, userId),
    onSuccess: () => {
      toast.success("Member removed successfully")
      queryClient.invalidateQueries({ queryKey: ['allProjects'] })
      queryClient.invalidateQueries({ queryKey: ['projectMembers'] })
    },
    onError: () => toast.error("Failed to remove member")
  })

  useEffect(() => {
    setIsLoading(true, "Loading...")

    if(!projectsLoading && !usersLoading && !projectLoading) {
      setIsLoading(false, "")
    }
  }, [projectsLoading, usersLoading, projectLoading])

  return (
    <div className="h-full rounded-lg flex flex-col gap-2">
      <div className="h-[5%] flex items-center gap-2">
        <h1>Admin Panel</h1>
      </div>
      <div className="h-[95%] border-t flex flex-col gap-2 py-2 overflow-y-auto">
        {/* project */}
        <div className="min-h-[50%] grid grid-cols-2">
          <div className="border-r px-3 flex flex-col gap-5">
            <label>
              Project Name
              <Input 
                placeholder="Project Name" 
                className="mt-2" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </label>
            <Button 
              className="w-20 self-end" 
              onClick={() => createProjectMutation.mutate({ name: projectName })}
              disabled={!projectName.trim()}
            >
              Create
            </Button>
          </div>
          <div className="px-2">
            {projects?.data?.data?.map((project: any) => {
              return (
                <div key={project.id} className="text-sm border w-[80%] p-2 rounded-md flex items-center justify-between mb-2">
                  <h1>{project.name}</h1>
                  <Button 
                    variant="destructive" 
                    onClick={() => deleteProjectMutation.mutate(project.id.toString())}
                  >
                    X
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
        <Separator />
        {/* assign member */}
        <div className="min-h-[50%] grid grid-cols-2">
          <div className="border-r px-3 flex flex-col gap-5 py-2">
            {/* projects */}
            <div className="flex justify-between items-center">
              <label>
                Projects
              </label>
              <SelectOptions 
                options={projects?.data?.data?.map((project: any) => ({id: project.id.toString(), name: project.name})) ?? []} 
                selectedValue={selectedProject} 
                setSelectedValue={setSelectedProject} 
              />
            </div>

            {/* members */}
            <div className="flex justify-between items-center">
              <label>
                Members
              </label>
              <SelectOptions 
                options={users?.data?.data?.map((user: any) => ({id: user.id.toString(), name: user.name || user.email})) ?? []} 
                selectedValue={selectedMember} 
                setSelectedValue={setSelectedMember} 
              />
            </div>
            <Button 
              className="w-20 self-end"
              onClick={() => assignMemberMutation.mutate({ 
                projectId: selectedProject.id, 
                userId: Number(selectedMember.id)
              })}
              disabled={!selectedProject.id || !selectedMember.id}
            >
              Assign
            </Button>
          </div>
          <div className="px-2 py-2">
            {/* assigned members */}
            {projectMembers?.data?.data?.map((member: any) => {
              return (
                <div key={member.id} className="text-sm border w-[80%] p-2 rounded-md flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h1>{member.name || member.email}</h1>
                    <p className="text-xs text-gray-500">Project ID: {member.projectId}</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => removeMemberMutation.mutate({ 
                      projectId: member.projectId.toString(), 
                      userId: member.userId.toString() 
                    })}
                  >
                    X
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
        {/* <Separator /> */}

        {/* <div className="min-h-[50%]">

        </div> */}
      </div>
    </div>
  )
}
