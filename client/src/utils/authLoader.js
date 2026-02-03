import { redirect } from "react-router";

export const protectedLoader = () => {
  const token = sessionStorage.getItem("at");

  if (!token) {
    throw redirect("/login");
  }

  return null;
};
