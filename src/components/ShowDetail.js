import React from "react";
import { useParams } from "react-router-dom";

export const ShowDetail = () => {
  let { id } = useParams();
  return <div>show Details {id}</div>;
};
