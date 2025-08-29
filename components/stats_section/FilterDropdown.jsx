import { useState, forwardRef, useEffect } from 'react';

export const FilterDropdown = forwardRef(({
  isOpen,
  toggle,
  options,
  selectedValue,
  placeholder,
  onSelect,
  onInputChange,
  loading,
  includeAllOption = true,
  allOptionText,
  classname='',
  optionKey = null, // For simple string options
  displayKey = null, // For object options - what to display
  valueKey = null // For object options - what to use as value
}, ref) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setInputValue(selectedValue || '');
    } else {
      setInputValue('');
    }
  }, [isOpen, selectedValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (onInputChange) {
      onInputChange(value);
    }
  };

  const handleItemSelect = (value) => {
    setInputValue(value);
    onSelect(value);
  };

  // Helper function to get display text from option
  const getOptionDisplayText = (option) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && typeof option === 'object') {
      if (displayKey) {
        return option[displayKey] || '';
      }
      if (optionKey) {
        return option[optionKey] || '';
      }
      return option.country_name || option.name || option.label || JSON.stringify(option);
    }
    return String(option);
  };

  // Helper function to get option value (for comparison and selection)
  const getOptionValue = (option) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && typeof option === 'object') {
      if (valueKey) {
        return option[valueKey] || '';
      }
      if (optionKey) {
        return option[optionKey] || '';
      }
      return option.country_name || option.name || option.label || JSON.stringify(option);
    }
    return String(option);
  };

  // Helper function to get the display text for selected value
  const getSelectedDisplayText = () => {
    if (!selectedValue) return placeholder;
    
    // For object options, find the matching option and get its display text
    if (valueKey && options && options.length > 0 && typeof options[0] === 'object') {
      const selectedOption = options.find(option => option[valueKey] === selectedValue);
      if (selectedOption) {
        return getOptionDisplayText(selectedOption);
      }
    }
    
    // For string options or fallback
    return selectedValue;
  };

  // Filter options based on input value
  const filteredOptions = onInputChange
    ? options
    : options?.filter(option => {
        const displayText = getOptionDisplayText(option);
        return displayText.toLowerCase().includes((inputValue || '').toLowerCase());
      });

  const displayOptions = inputValue === '' ? options : filteredOptions;

  // Check if selected value matches an option
  const isOptionSelected = (option) => {
    const optionValue = getOptionValue(option);
    return selectedValue === optionValue;
  };

  return (
    <li className={`filter-dropdown-list ${classname} ${isOpen ? 'active' : ''}`} ref={ref}>
      <div className={`form-select`} onClick={toggle}>
        {getSelectedDisplayText()}
      </div>

      {isOpen && (
        <div className="dropdown-menu show">
          <div className="search-container">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder={`Search`}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSelect(inputValue);
                    toggle();
                  }
                }}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center p-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <ul className="dropdown-options">
              {includeAllOption && (
                <li
                  className={`dropdown-item ${selectedValue === '' ? 'selected' : ''}`}
                  onClick={() => handleItemSelect('')}
                >
                  {allOptionText || 'All'}
                </li>
              )}
              {(onInputChange ? options : displayOptions).map(option => (
                <li
                  key={getOptionValue(option)}
                  className={`dropdown-item ${isOptionSelected(option) ? 'selected' : ''}`}
                  onClick={() => handleItemSelect(getOptionValue(option))}
                >
                  {getOptionDisplayText(option)}
                </li>
              ))}
              {(onInputChange ? options : displayOptions).length === 0 && inputValue && (
                <li className="dropdown-item text-muted">
                  No matches found
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </li>
  );
});
