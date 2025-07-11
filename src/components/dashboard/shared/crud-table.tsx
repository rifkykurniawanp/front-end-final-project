import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { CrudTableProps } from '@/types/dashboard';

export const CrudTable = <T extends { id: number }>({ 
  title, 
  data, 
  columns, 
  onAdd, 
  onEdit, 
  onDelete 
}: CrudTableProps<T>) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <Button size="sm" onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={String(col.accessor)}>{col.Header}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
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
              <TableCell className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit?.(row)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete?.(row)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);