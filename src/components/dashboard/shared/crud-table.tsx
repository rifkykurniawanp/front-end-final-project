// Refactored CRUD Table Component
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Column<T> {
  Header: string;
  accessor: keyof T;
}

interface CrudTableProps<T extends { id: number }> {
  title: string;
  columns: Column<T>[];
  fetchData: () => Promise<T[]>;
  onAdd?: () => void | Promise<void>;
  onEdit?: (row: T) => Promise<T | void>;
  onDelete?: (row: T) => Promise<void>;
}

const CrudTable = <T extends { id: number }>({
  title,
  columns,
  fetchData,
  onAdd,
  onEdit,
  onDelete,
}: CrudTableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchData();
      setData(res);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = async (row: T) => {
    if (!onEdit) return;
    const updated = await onEdit(row);
    if (updated) setData(prev => prev.map(r => (r.id === updated.id ? updated : r)));
    else await loadData(); // fallback refetch
  };

  const handleDelete = async (row: T) => {
    if (!onDelete) return;
    await onDelete(row);
    setData(prev => prev.filter(r => r.id !== row.id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {onAdd && (
            <Button size="sm" onClick={onAdd}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(col => (
                  <TableHead key={String(col.accessor)}>{col.Header}</TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map(row => (
                <TableRow key={row.id}>
                  {columns.map(col => (
                    <TableCell key={String(col.accessor)}>
                      {String(row[col.accessor])}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="flex gap-2">
                      {onEdit && (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(row)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CrudTable;
