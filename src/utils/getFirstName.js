export const getFirstName = (fullName = " ") => {
  return fullName.trim().split(" ")[0];
}