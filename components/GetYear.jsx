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
