import { useState } from "react";

export const useSubmit = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (asyncFunc) => {
    if (loading) return;

    setLoading(true);
    try {
      await asyncFunc();
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSubmit };
};
