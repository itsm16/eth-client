import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectOptions({options, selectedValue, setSelectedProject}: {options: string[], selectedValue: string, setSelectedProject: (value: string) => void}) {
  return (
    <Select value={selectedValue} onValueChange={setSelectedProject}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder={options[0]} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Project</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
