import { ReactNode, useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { EmptyState } from './EmptyState';
import { TableRowSkeleton } from './LoadingSkeleton';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  keyExtractor: (row: T) => string;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T>({
  data,
  columns,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  onRowClick,
  emptyTitle = 'No data found',
  emptyDescription,
  keyExtractor,
  className = '',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Filter data by search
  const filteredData = useMemo(() => {
    if (!search || searchKeys.length === 0) return data;

    const searchLower = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const value = row[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchLower);
      })
    );
  }, [data, search, searchKeys]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ChevronsUpDown size={14} className="text-slate-600" />;
    if (sortDirection === 'asc') return <ChevronUp size={14} className="text-indigo-400" />;
    return <ChevronDown size={14} className="text-indigo-400" />;
  };

  return (
    <div className={`bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden ${className}`}>
      {/* Search bar */}
      {searchable && (
        <div className="p-4 border-b border-slate-700">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={searchPlaceholder}
            className="max-w-sm"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`text-left p-4 text-sm font-medium text-slate-400 ${col.headerClassName || ''}`}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(String(col.key))}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {col.header}
                      {getSortIcon(String(col.key))}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={columns.length} />
              ))
            ) : sortedData.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              // Data rows
              sortedData.map((row, index) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`border-t border-slate-700 hover:bg-slate-800/50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className={`p-4 ${col.className || ''}`}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      {!loading && sortedData.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-700 text-sm text-slate-500">
          Showing {sortedData.length} of {data.length} records
        </div>
      )}
    </div>
  );
}
