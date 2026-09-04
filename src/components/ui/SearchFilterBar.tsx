import React from 'react';
import { Search } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelect {
  name: string;
  value: string;
  placeholder: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterSelect[];
  className?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search records, categories or topics...',
  filters = [],
  className = ''
}) => {
  return (
    <div className={`flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777777]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 neu-inset text-sm text-[#242424] placeholder-[#777777] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#242424]"
        />
      </div>

      {/* Dynamic Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map(filter => (
            <select
              key={filter.name}
              value={filter.value}
              onChange={e => filter.onChange(e.target.value)}
              className="neu-raised-soft text-xs md:text-sm text-[#242424] px-3 py-2.5 rounded-lg border border-[#D8D8D3] focus:outline-none focus:ring-1 focus:ring-[#242424] cursor-pointer"
            >
              <option value="All">{filter.placeholder}</option>
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </div>
  );
};
