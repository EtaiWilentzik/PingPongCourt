import { Navigate, useNavigate } from "react-router-dom";

import { useEffect } from "react";
const ErrorRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return <div id="notfound">Not found</div>;
};
export { ErrorRoute };
