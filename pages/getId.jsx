export const getItemId = (item, keysarray) => {
  console.log("keysarray", keysarray, item, "item");

  // check for race keys
  const raceKeys = ["Race_Name", "RaceName", "raceName", "Race", "race_name", "race"];
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

  // check for rider keys
  const riderKeys = ["rider_id", "riderId", "_id", "id", "rider_key"];
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

export const getTeamId = (item) => {
  const keys = ["team_name", "teamName", "team", "team_Name", "TeamName"];
  for (const key of keys) {
    if (
      item &&
      item[key] !== undefined &&
      item[key] !== null &&
      item[key] !== ""
    ) {
      return item[key];
    }
  }
  return null;
};