import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option...',
  disabled = false,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  size = 'md',
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  const isSmall = size === 'sm';

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-block ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 border border-black/10 rounded-lg bg-white/95 text-camry-blackout font-martian shadow-xs transition-all duration-150 hover:bg-white hover:border-black/20 focus:outline-none focus:ring-2 focus:ring-camry-carrier/40 ${
          isSmall ? 'px-2.5 py-1 text-xs' : 'px-3 py-2 text-xs sm:text-sm font-semibold'
        } ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed bg-zinc-100' : 'cursor-pointer'} ${buttonClassName}`}
      >
        <div className="flex items-center gap-1.5 truncate min-w-0">
          {label && (
            <span className="text-camry-graphite/60 uppercase tracking-wider font-medium text-[10px] sm:text-xs shrink-0">
              {label}
            </span>
          )}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={isSmall ? 14 : 16} 
          className={`text-camry-graphite/60 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-camry-blackout' : ''
          }`} 
        />
      </button>

      {/* Custom Dropdown Menu Popover */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-1 min-w-[200px] max-h-64 overflow-y-auto bg-camry-blackout text-white border border-white/10 rounded-xl shadow-2xl p-1.5 font-martian text-xs ${
              fullWidth ? 'w-full' : 'right-0 sm:left-0'
            } ${menuClassName}`}
          >
            <div className="space-y-0.5">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-white/15 text-white font-bold border-white/20'
                        : 'text-white/80 hover:bg-white/10 hover:text-white border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 truncate">
                        {opt.icon && <span>{opt.icon}</span>}
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {opt.description && (
                        <div className={`text-[10px] font-normal mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-white/50'}`}>
                          {opt.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check size={14} className="text-emerald-400 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
