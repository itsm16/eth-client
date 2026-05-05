import { useState } from "react"
import { SelectOptions } from "../select-options"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"

const projectData = [
  { id: 1, name: "Project 1" },
  { id: 2, name: "Project 2" },
  { id: 3, name: "Project 3" },
]

export const AdminPanel = () => {
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedMember, setSelectedMember] = useState("")

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
              <Input placeholder="Project Name" className="mt-2" />
            </label>
            <Button className="w-20 self-end">Create</Button>
          </div>
          <div className="px-2">
            {projectData.map((project) => {
              return (
                <div key={project.id} className="text-sm border w-[80%] p-2 rounded-md flex items-center justify-between mb-2">
                  <h1>{project.name}</h1>
                  <Button variant="destructive">X</Button>
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
              <SelectOptions options={projectData?.map((project) => project?.name)} selectedValue={selectedProject} setSelectedProject={setSelectedProject} />
            </div>

            {/* members */}
            <div className="flex justify-between items-center">
              <label>
                Members
              </label>
              <SelectOptions options={projectData?.map((project) => project?.name)} selectedValue={selectedProject} setSelectedProject={setSelectedProject} />
            </div>
            <Button className="w-20 self-end">Create</Button>
          </div>
          <div className="px-2 py-2">
            {/* members */}
            {projectData.map((project) => {
              return (
                <div key={project.id} className="text-sm border w-[80%] p-2 rounded-md flex items-center justify-between mb-2">
                  <h1>{project.name}</h1>
                  <Button variant="destructive">X</Button>
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
