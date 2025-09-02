
import React from 'react';
import { Language, UIStringKeys } from '../../types'; // Added Language, UIStringKeys
import { getText } from '../../constants'; // Added getText

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  lang: Language; // Added lang prop
}

const Select: React.FC<SelectProps> = ({ label, id, options, lang, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-[#0A263B] mb-1 font-['Open_Sans']">
        {label}
      </label>
      <select
        id={id}
        className="w-full px-4 py-2.5 bg-white border border-[#ACB4B6] rounded-lg text-[#0A263B] focus:ring-2 focus:ring-[#36A7B7] focus:border-[#36A7B7] outline-none transition-colors duration-150 appearance-none font-['Open_Sans']"
        {...rest}
      >
        <option value="">{getText(lang, UIStringKeys.SelectDefaultOption)}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
