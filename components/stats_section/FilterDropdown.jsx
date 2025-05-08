// export const FilterDropdown = ({
//     ref,
//     isOpen,
//     toggle,
//     options,
//     selectedValue,
//     placeholder,
//     onSelect,
//     loading,
//     includeAllOption = true,
//     allOptionText
//   }) => (
//     <li className={isOpen ? 'active' : ''} ref={ref}>
//       <div className="form-select" onClick={toggle}>
//         {selectedValue || placeholder}
//       </div>
      
//       {isOpen && (
//         <div className="dropdown-menu show">
//           <div className="search-container">
//             <div className="input-group">
//               {/* <span className="input-group-text">
//                 <svg 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   width="16" 
//                   height="16" 
//                   fill="currentColor" 
//                   className="bi bi-search" 
//                   viewBox="0 0 16 16"
//                 >
//                   <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
//                 </svg>
//               </span> */}
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder={`Search ${placeholder.toLowerCase()}...`}
//                 value={selectedValue}
//                 onChange={(e) => onSelect(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     toggle();
//                   }
//                 }}
//               />
//             </div>
//           </div>
          
//           {loading ? (
//             <div className="text-center p-3">
//               <div className="spinner-border spinner-border-sm" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : (
//             <ul className="dropdown-options">
//               {includeAllOption && (
//                 <li 
//                   className="dropdown-item"
//                   onClick={() => onSelect('')}
//                 >
//                   {allOptionText}
//                 </li>
//               )}
//               {options.map(option => (
//                 <li 
//                   key={option} 
//                   className="dropdown-item"
//                   onClick={() => onSelect(option)}
//                 >
//                   {option}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </li>
//   );

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
  allOptionText
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  
  // Update input value when dropdown opens or selectedValue changes
  useEffect(() => {
    if (!isOpen) {
      setInputValue(selectedValue || '');
    }
  }, [isOpen, selectedValue]);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // If onInputChange is provided, call it with the new value
    if (onInputChange) {
      onInputChange(value);
    }
  };
  
  const handleItemSelect = (value) => {
    setInputValue(value);
    onSelect(value);
  };
  
  // Filter options based on input value unless parent is handling filtering
  const filteredOptions = onInputChange 
    ? options // Parent component is handling filtering
    : options.filter(option => 
        option.toLowerCase().includes((inputValue || '').toLowerCase())
      );
  
  return (
    <li className={isOpen ? 'active' : ''} ref={ref}>
      <div className="form-select" onClick={toggle}>
        {selectedValue || placeholder}
      </div>
      
      {isOpen && (
        <div className="dropdown-menu show">
          <div className="search-container">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
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
                  className="dropdown-item"
                  onClick={() => handleItemSelect('')}
                >
                  {allOptionText || 'All'}
                </li>
              )}
              {filteredOptions.map(option => (
                <li 
                  key={option} 
                  className="dropdown-item"
                  onClick={() => handleItemSelect(option)}
                >
                  {option}
                </li>
              ))}
              {filteredOptions.length === 0 && inputValue && (
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