'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type Row,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { DataTablePagination } from './data-table-pagination'
import type { Receipt } from '@/data/receipts'
import { EditableItemCell } from './editable-cell'
import { Button } from './ui/button'
import { PlusIcon } from '@radix-ui/react-icons'

interface DataTableProps<TData extends Receipt, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  handleButtonDisable: React.Dispatch<React.SetStateAction<boolean>>
}

export function DataTable<TData extends Receipt, TValue>({
  columns,
  data,
  handleButtonDisable,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const renderSubComponent = ({ row }: { row: Row }) => {
    return (
      <Table className="pl-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead className="w-20">Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="w-32">Finalidade</TableHead>
            <TableHead className="w-40">Centro de Custos</TableHead>
            <TableHead className="w-32">Atividade</TableHead>
            <TableHead className="w-20">Quantidade</TableHead>
            <TableHead className="w-20">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {row.original.items.map((item) => {
            return (
              <TableRow key={item.key}>
                <TableCell>
                  <button className="mx-auto" onClick={() => alert('Função não implementada!')}>
                    ➕
                  </button>
                </TableCell>
                <TableCell>
                  <EditableItemCell cell={item.code} row={row} type="text" valueName="code" />
                </TableCell>
                <TableCell>
                  <EditableItemCell cell={item.name} row={row} type="text" valueName="name" />
                </TableCell>
                <TableCell>
                  <EditableItemCell cell={item.purpose} row={row} type="text" valueName="purpose" />
                </TableCell>
                <TableCell>
                  <EditableItemCell cell={item.costCenter} row={row} type="text" valueName="costCenter" />
                </TableCell>
                <TableCell>
                  <EditableItemCell cell={item.activity} row={row} type="text" valueName="activity" />
                </TableCell>
                <TableCell>
                  <EditableItemCell cell={item.quantity} row={row} type="text" valueName="quantity" />
                </TableCell>
                <TableCell>
                  <EditableItemCell cell={item.unitPriceInCents} row={row} type="currency" valueName="unitPriceInCents" />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  })

  React.useEffect(() => {
    handleButtonDisable(table.getIsAllRowsSelected())
  }, [table])

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        <>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </>
                      </TableRow>
                      {row.getIsExpanded() && (
                        <tr>
                          {/* 2nd row is a custom 1 cell row */}
                          <>
                            <td colSpan={12}>
                              {renderSubComponent({ row })}
                            </td>

                            {console.log(row)}
                          </>
                        </tr>
                      )}
                    </React.Fragment>

                  ))
                )
              : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nenhuma nota encontrada.
                  </TableCell>
                </TableRow>
                )}
          </TableBody>

          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => {
                  return (
                    <TableHead key={footer.id} colSpan={footer.colSpan}>
                      {footer.isPlaceholder
                        ? null
                        : flexRender(
                          footer.column.columnDef.footer,
                          footer.getContext(),
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableFooter>

        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
