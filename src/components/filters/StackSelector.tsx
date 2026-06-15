import { Select } from "@/components/ui/select";

export function StackSelector({
  value,
  stacks,
  onChange,
}: {
  value: string;
  stacks: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="all">Todas as stacks</option>
      {stacks.map((stack) => (
        <option key={stack} value={stack}>
          {stack}
        </option>
      ))}
    </Select>
  );
}
