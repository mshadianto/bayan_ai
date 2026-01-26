import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface UseHCMSDataOptions<T> {
  search?: string;
  searchKeys?: (keyof T)[];
  filter?: string;
  filterKey?: keyof T;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

interface UseHCMSDataReturn<T> {
  data: T[];
  filteredData: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useHCMSData<T>(
  fetcher: () => Promise<T[]>,
  options: UseHCMSDataOptions<T> = {}
): UseHCMSDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const debouncedSearch = useDebounce(options.search || '', 300);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply filter
    if (options.filter && options.filter !== 'all' && options.filterKey) {
      result = result.filter((item) => {
        const value = item[options.filterKey!];
        return String(value).toLowerCase() === options.filter!.toLowerCase();
      });
    }

    // Apply search
    if (debouncedSearch && options.searchKeys && options.searchKeys.length > 0) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter((item) =>
        options.searchKeys!.some((key) => {
          const value = item[key];
          return value != null && String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply sort
    if (options.sortKey) {
      result.sort((a, b) => {
        const aVal = a[options.sortKey!];
        const bVal = b[options.sortKey!];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return options.sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [data, debouncedSearch, options.filter, options.filterKey, options.searchKeys, options.sortKey, options.sortDirection]);

  return {
    data,
    filteredData,
    loading,
    error,
    refetch: fetchData,
  };
}
