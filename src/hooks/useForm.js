import { useState } from "react";

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const reset = () => setValues(initialValues);

  return { values, setValues, handleChange, reset };
}