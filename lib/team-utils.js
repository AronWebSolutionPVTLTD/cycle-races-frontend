// Shared utility function for creating team slugs
// This ensures consistent slug generation across all components
export const createTeamSlug = (teamName) => {
  if (!teamName) return "";
  return teamName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
};

