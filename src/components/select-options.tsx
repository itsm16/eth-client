import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectOptions({options, selectedValue, setSelectedValue}: {
  options: {id: string, name: string}[], 
  selectedValue: {id: string, name: string}, 
  setSelectedValue: (value: {id: string, name: string}) => void
}) {

  return (
    <Select value={selectedValue.id} onValueChange={(value) => {
      const selectedOption = options.find((option) => option.id === value);
      if (selectedOption) {
        setSelectedValue(selectedOption);
      }
    }}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder={options[0]?.name} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Project</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option?.id} value={option?.id ?? option}>
              {option.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
