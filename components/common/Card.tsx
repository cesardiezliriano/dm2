
import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '' }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl p-6 border border-[#DDDDDD] ${className}`}> {/* LLYC White bg, Gris 04 border */}
      {title && (
        <h3 className={`text-xl font-semibold text-[#36A7B7] mb-4 font-['Montserrat'] ${titleClassName}`}> {/* LLYC Turquoise for title */}
          {title}
        </h3>
      )}
      <div className="font-['Open_Sans'] text-[#0A263B]"> {/* Ensure card content uses Open Sans and LLYC Dark Blue */}
        {children}
      </div>
    </div>
  );
};

export default Card;
