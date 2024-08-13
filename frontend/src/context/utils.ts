export function getUser(): boolean {
  const token = document.cookie.split(";").find((token) => {
    return token.includes("user");
  });

  if (token) {
    return true;
  }

  return false;
}
