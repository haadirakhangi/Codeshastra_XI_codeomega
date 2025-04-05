import { useState } from "react";

const usePost = <T, D>(
  postFunction: (data: D) => Promise<T>,
  initialData?: D
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const postData = async (payload: D) => {
    try {
      setLoading(true);
      setError(null);

      const result = await postFunction(payload);
      setData(result);
      return result;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("An unknown error occurred");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    post: postData,
    reset,
  };
};

export default usePost;
