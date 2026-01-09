export const createTeamSlug = (teamName) => {
  if (!teamName) return "";
  return teamName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-") 
    .replace(/^-|-$/g, ""); 
};

