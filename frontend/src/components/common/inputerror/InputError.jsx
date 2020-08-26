import React, { useEffect, useState } from "react";

import "./InputError.css";

const InputError = ({ fieldKey, details }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    const detail = details.filter((d) => d.context.key === fieldKey);
    setError(detail.length > 0 ? detail[0].message : "");
  }, [details, fieldKey]);

  return <span className="error-feedback">{error}</span>;
};

export default InputError;
