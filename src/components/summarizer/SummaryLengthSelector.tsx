
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SummaryLengthSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SummaryLengthSelector: React.FC<SummaryLengthSelectorProps> = ({
  value,
  onChange,
  disabled
}) => {
  return (
    <>
      <label htmlFor="summary-length" className="block text-sm font-medium text-foreground mb-2">
        Summary Length
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Summary length" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="concise">Concise</SelectItem>
          <SelectItem value="balanced">Balanced</SelectItem>
          <SelectItem value="detailed">Detailed</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default SummaryLengthSelector;
