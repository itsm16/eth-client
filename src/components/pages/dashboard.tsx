import { Board } from "../board";
import { Modal } from "../modal";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useLoaderStore from "@/store/useLoaderStore";
import { SelectOptions } from "../select-options";
import { getProjectTasks, getUserProjects } from "@/utils/query-functions";
import useUserStore from "@/store/user-store";

export default function Dashboard() {
  const { setIsLoading } = useLoaderStore(state => state)
  const {user} = useUserStore()
  const {data: projectsData,isLoading: projectsLoading} = useQuery({
    queryFn: () => getUserProjects(user?.id!), 
    queryKey: ["projects"], 
    enabled:!!user?.id
  })
  const [selectedProject, setSelectedProject] = useState<{id: string, name: string}>({
    id: projectsData?.data?.data?.[0]?.id,
    name: projectsData?.data?.data?.[0]?.name
  })

  const {data: tasks,isLoading: tasksLoading} = useQuery({
    queryFn: () => getProjectTasks(Number(selectedProject?.id)), 
    queryKey: ["tasks", selectedProject], // does call on selectedProject change
    retry: 1, 
    enabled:!!projectsData
  })
  
  useEffect(()=>{
    setIsLoading(true, "Loading projects...")    
    
    if(!projectsLoading && !tasksLoading){
      setIsLoading(false)
    }

    setSelectedProject({
      id: projectsData?.data?.data?.[0]?.id,
      name: projectsData?.data?.data?.[0]?.name
    })
  }, [projectsLoading, setIsLoading, tasksLoading, projectsData, setSelectedProject])

  return (
    <>
      <div className="h-full rounded-lg flex flex-col gap-2">
        <div className="h-[5%] flex items-center gap-2">
            {/* admin */}
            <SelectOptions selectedValue={selectedProject as {id: string, name: string}} setSelectedValue={setSelectedProject} options={projectsData?.data?.data || []}/>
          {user?.role.toLowerCase() === "admin" && <Modal projectId={selectedProject.id} />}
        </div>
        <div className="h-[95%] border-t">
            {/* admin */}
          <Board admin={user?.role.toLowerCase() === "admin"} tasks={tasks?.data?.data || []} projectId={selectedProject.id} />
        </div>
      </div>
    </>
  )
}