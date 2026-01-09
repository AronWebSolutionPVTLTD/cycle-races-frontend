export const getItemId = (item, keysarray) => {
  if (!keysarray || !Array.isArray(keysarray)) {
    return null;
  }

  const raceKeys = ["Race_Name", "RaceName", "raceName", "Race", "race_name", "race", "race_full_title"];
  for (const key of raceKeys) {
    if (
      item &&
      item[key] !== undefined &&
      item[key] !== null &&
      item[key] !== ""
      && keysarray.includes(key)
    ) {
      return { type: "race", id: item[key] };
    }
  }

  const riderKeys = ["rider_id", "riderId", "_id", "id", "rider_key", "winner_id"];
  for (const key of riderKeys) {
    if (
      item &&
      item[key] !== undefined &&
      item[key] !== null &&
      item[key] !== ""
      && keysarray.includes(key)
    ) {
      return { type: "rider", id: item[key] };
    }
  }

  const teamKeys = ["team_name", "teamName", "team", "team_Name", "TeamName"];
  for (const key of teamKeys) {
    if (
      item &&
      item[key] !== undefined &&
      item[key] !== null &&
      item[key] !== ""
      && keysarray.includes(key)
    ) {
      return { type: "team", id: item[key] };
    }
  }

  return null;
};

