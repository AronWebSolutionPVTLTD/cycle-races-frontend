import { useState, forwardRef, useEffect, useRef } from 'react';
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
  classname = '',
  optionKey = null,
  displayKey = null,
  valueKey = null
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const optionRefs = useRef({});

  useEffect(() => {
    if (!isOpen) {
      setInputValue(selectedValue || '');
    } else {
      setInputValue('');
      if (selectedValue && optionRefs.current[selectedValue]) {
        optionRefs.current[selectedValue].scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        });
      }
    }
  }, [isOpen, selectedValue]);

  const isAllOption = () => {
    if (selectedValue === '' && includeAllOption) return true;
    if (!selectedValue) return false;
    const allOptions = ["All-time", "All-Nationalities", ""];
    return allOptions.includes(selectedValue);
  };

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

  const getOptionDisplayText = (option) => {
    if (typeof option === 'string') return option;
    if (option && typeof option === 'object') {
      if (displayKey) return option[displayKey] || '';
      if (optionKey) return option[optionKey] || '';
      return option.country_name || option.name || option.label || JSON.stringify(option);
    }
    return String(option);
  };

  const getOptionValue = (option) => {
    if (typeof option === 'string') return option;
    if (option && typeof option === 'object') {
      if (valueKey) return option[valueKey] || '';
      if (optionKey) return option[optionKey] || '';
      return option.country_name || option.name || option.label || JSON.stringify(option);
    }
    return String(option);
  };

  const getSelectedDisplayText = () => {
    if (selectedValue === '' && includeAllOption && allOptionText) {
      return allOptionText;
    }
    if (!selectedValue) return placeholder;
    if (valueKey && options && options.length > 0 && typeof options[0] === 'object') {
      const selectedOption = options.find(option => option[valueKey] === selectedValue);
      if (selectedOption) {
        return getOptionDisplayText(selectedOption);
      }
    }
    return selectedValue;
  };

  const filteredOptions = onInputChange
    ? options
    : options?.filter(option => {
      const displayText = getOptionDisplayText(option);
      return displayText.toLowerCase().includes((inputValue || '').toLowerCase());
    });

  const displayOptions = inputValue === '' ? options : filteredOptions;

  const isOptionSelected = (option) => {
    const optionValue = getOptionValue(option);
    return selectedValue === optionValue;
  };

  return (
    <li className={`filter-dropdown-list ${classname} ${isOpen ? 'active' : ''}`} ref={ref}>
      <div className={`form-select ${selectedValue && !isAllOption() ? "selected" : ""}`} onClick={toggle}>
        {getSelectedDisplayText()}
      </div>

      {isOpen && (
        <div className='dropdown-wrapper dropdown-menu show'>
        <div className="">
          <div className="search-container">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
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
                  ref={el => (optionRefs.current[''] = el)}
                >
                  {allOptionText}
                </li>
              )}
              {(onInputChange ? options : displayOptions).map(option => {
                const value = getOptionValue(option);
                return (
                  <li
                    key={value}
                    className={`dropdown-item ${isOptionSelected(option) ? 'selected' : ''}`}
                    onClick={() => handleItemSelect(value)}
                    ref={el => (optionRefs.current[value] = el)}
                  >
                    {getOptionDisplayText(option)}
                  </li>
                );
              })}
              {(onInputChange ? options : displayOptions).length === 0 && inputValue && (
                <li className="dropdown-item text-muted">
                  No matches found
                </li>
              )}
            </ul>
          )}
        </div>
        </div>
      )}
    </li>
  );
});
