import React from 'react';
import Link from 'next/link';

/**
 * A flexible StatsSection component that can display various types of statistics
 * 
 * @param {Object} props - Component properties
 * @param {string} props.title - Section title
 * @param {Array} props.data - Data to display
 * @param {string} props.year - Selected year
 * @param {string} props.nationality - Selected nationality
 * @param {string} props.team - Selected team
 * @param {Array} props.columns - Column configuration
 * @param {string} props.emptyMessage - Message to show when no data is available
 */
const StatsSection = ({ 
  title, 
  data = [], 
  year, 
  nationality, 
  team, 
  columns = [], 
  emptyMessage = "No data available for the selected filters." 
}) => {
  // If data is undefined or empty
  if (!data || data.length === 0) {
    return (
      <div className="stats-section">
        <h2>{title}</h2>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Format filters for display
  const filterInfo = [];
  if (year) filterInfo.push(`Year: ${year}`);
  if (nationality) filterInfo.push(`Nationality: ${nationality}`);
  if (team) filterInfo.push(`Team: ${team}`);

  // Default columns if none provided
  const defaultColumns = [
    { key: 'rank', label: 'Rank', render: (_, index) => index + 1 },
    { 
      key: 'rider_name', 
      label: 'Rider', 
      render: (item) => (
        <Link href={`/rider/${item.rider_id || item.id}`}>
          {item.rider_name || item.name}
        </Link>
      ) 
    },
    { key: 'team_name', label: 'Team', render: (item) => item.team_name || item.team },
    { key: 'nationality', label: 'Nationality', render: (item) => item.nationality || item.country }
  ];

  // Use provided columns or defaults
  const tableColumns = columns.length > 0 ? columns : defaultColumns;

  return (
    <div className="stats-section">
      <div className="section-header">
        <h2>{title}</h2>
        {filterInfo.length > 0 && (
          <div className="filter-info">
            <small>Filtered by: {filterInfo.join(' | ')}</small>
          </div>
        )}
      </div>
      
      <div className="stats-table-container">
        <table className="stats-table">
          <thead>
            <tr>
              {tableColumns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={`${item.rider_id || item.id || index}`}>
                {tableColumns.map((col) => (
                  <td key={`${col.key}-${index}`} className={col.className || ''}>
                    {col.render ? col.render(item, index) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsSection;