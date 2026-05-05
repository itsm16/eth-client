import { Board } from "../board";
import { Modal } from "../modal";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useLoaderStore from "@/store/useLoaderStore";
import { SelectOptions } from "../select-options";

const data = [
  { id: 1, name: "Project 1", task_count: 5, tasks: [{ id: 1, title: "learn jenkins", status: "TODO" }, { id: 2, title: "learn docker", status: "IN_PROGRESS" }, { id: 3, title: "learn kubernetes", status: "DONE" }] },
  { id: 2, name: "Project 2", task_count: 3, tasks: [ { id: 4, title: "learn git", status: "TODO" }, { id: 5, title: "learn github", status: "TODO" }] },
  { id: 3, name: "Project 3", task_count: 2, tasks: [] },
]

export default function Dashboard() {
  const { setIsLoading } = useLoaderStore(state => state)
  const [applications, setApplications] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string>(data[0].name)

  console.log(selectedProject)
  return (
    <>
      <div className="h-full rounded-lg flex flex-col gap-2">
        <div className="h-[5%] flex items-center gap-2">
            {/* admin */}
            {/* {false && <SelectOptions selectedValue={selectedProject} setSelectedProject={setSelectedProject} options={data.map(project => project.name)}/>} */}
          <Modal />
        </div>
        <div className="h-[95%] border-t">
            {/* admin */}
          <Board admin={true} tasks={data.find(project => project.name === selectedProject)?.tasks || []} />
        </div>
      </div>
    </>
  )
}