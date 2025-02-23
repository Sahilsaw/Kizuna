import React, { useState, useEffect, useRef } from 'react';
import { UserPlus } from "lucide-react";

const MultiSelectSearch = ({ 
  options = [], 
  placeholder = "Search...",
  selectedItems = [],       // Receive selected items as prop
  onSelectionChange,        // Callback when selection changes
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Filter options 
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedItems.find(item => item.value === option.value)
  );

  // Click outside handler 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    const newSelection = [...selectedItems, item];
    onSelectionChange(newSelection);  // Notify parent
    setSearchQuery('');
    setIsOpen(false);
  };

  const removeItem = (itemToRemove) => {
    const newSelection = selectedItems.filter(item => item.value !== itemToRemove.value);
    onSelectionChange(newSelection);  // Notify parent
  };

  return (
    <div className="multi-select-container" ref={wrapperRef}>
      <div className="selected-items">
        {selectedItems.map(item => (
          <div key={item.value} className="btn btn-outline btn-success btn-xs mb-3 ml-0.5">
            {item.label}
            <button onClick={() => removeItem(item)} className="remove-btn">
              &times;
            </button>
          </div>
        ))}
            {/*Search Button*/}
            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                  <UserPlus className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                  }}
                />
              </div>
            </div>


      </div>

      {isOpen && (
        <div className="join join-vertical flex justify-center mt-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className="btn join-item"
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="btn join-item">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectSearch;

