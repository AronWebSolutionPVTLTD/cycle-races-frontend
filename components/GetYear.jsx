// Generate year options from 1990 to current year (2025)
  // export const generateYearOptions = () => {
  //   const currentYear = 2025;
  //   const startYear = 1990;
  //   const yearOptions = ['All-time'];
    
  //   for (let year = currentYear; year >= startYear; year--) {
  //     yearOptions.push(year.toString());
  //   }
    
  //   return yearOptions;
  // };
export const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1990;

  const withAllTime = ['All-time'];
  const withoutAllTime = [];

  for (let year = currentYear; year >= startYear; year--) {
    const yearStr = year.toString();
    withAllTime.push(yearStr);
    withoutAllTime.push(yearStr);
  }

  return { withAllTime, withoutAllTime };
};
