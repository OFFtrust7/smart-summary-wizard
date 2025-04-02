
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface SummaryInputFieldProps {
  inputType: 'text' | 'url' | 'youtube';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SummaryInputField: React.FC<SummaryInputFieldProps> = ({
  inputType,
  value,
  onChange,
  placeholder,
  disabled
}) => {
  return inputType === 'text' ? (
    <Textarea
      id="text-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="min-h-[150px] resize-none transition-all duration-200 focus:shadow-md"
      disabled={disabled}
    />
  ) : (
    <Input
      id="url-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="transition-all duration-200 focus:shadow-md"
      disabled={disabled}
    />
  );
};

export default SummaryInputField;
