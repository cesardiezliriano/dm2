
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-[#0A263B] mb-1 font-['Open_Sans']"> {/* LLYC Dark Blue for label */}
        {label}
      </label>
      <input
        id={id}
        className="w-full px-4 py-2.5 bg-white border border-[#ACB4B6] rounded-lg text-[#0A263B] placeholder-[#ACB4B6] focus:ring-2 focus:ring-[#36A7B7] focus:border-[#36A7B7] outline-none transition-colors duration-150 font-['Open_Sans']" /* LLYC styles: White bg, Gris 03 border, Dark Blue text, Turquoise focus */
        {...rest}
      />
    </div>
  );
};

export default Input;