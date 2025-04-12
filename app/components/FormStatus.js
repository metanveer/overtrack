import React from "react";

const FormStatus = ({ state }) => {
  if (state?.success === true) {
    return <p className="text-green-600 font-medium">{state.message}</p>;
  }

  if (state?.success === false) {
    return <p className="text-red-600 font-medium">{state.message}</p>;
  }

  return null;
};

export default FormStatus;
