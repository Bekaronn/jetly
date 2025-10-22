import { useState, useEffect, useCallback } from 'react';

type QueryFunction<T> = () => Promise<T>;

interface UseQueryOptions {
  enabled?: boolean; 
}

interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useQuery = <T>(
  queryFn: QueryFunction<T>,
  deps: any[] = [],
  options: UseQueryOptions = { enabled: true } 
): UseQueryResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(options.enabled ?? true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [...deps, options.enabled]);

  useEffect(() => {
    if (options.enabled) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [fetchData, options.enabled]); 

  return { data, isLoading, error, refetch: fetchData };
};