import type { ColumnDef } from '@tanstack/react-table'
import type { ReceiptAsMessage } from './receipts'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table-colum-header'
import { Skeleton } from '@/components/ui/skeleton'

import { UploadIcon, ClockIcon, CheckCircledIcon } from '@radix-ui/react-icons'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br.js'
import { EditableCell } from '@/components/editable-cell'
dayjs.locale('pt-br')

const statuses = {
  processing: { label: 'Processando', icon: ClockIcon },
  done: { label: 'Pronto', icon: CheckCircledIcon },
}

const defaultStatus = { label: 'Enviando', icon: UploadIcon }

export const columns: ColumnDef<ReceiptAsMessage>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsAllPageRowsSelected() && 'indeterminate') ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    footer: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as ('processing' | 'done')
      const label = (statuses[status] ?? defaultStatus).label
      const Icon = (statuses[status] ?? defaultStatus).icon
      return (
        <div className="flex space-x-2 items-center w-[100px]">
          <>
            <Icon className="h-3 w-3 text-muted-foreground" />
            <span className="max-w-[100px] truncate font-medium">
              {label}
            </span>
          </>
        </div>
      )
    },
    footer: () => {
      return <span className="text-xs">Selecionar Página</span>
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'supplier',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fornecedor" />
    ),
    cell: ({ cell, row }) => {
      return (
        row.getValue('supplier')
          ? (
            // <div className="flex space-x-2">
            //   <span className="max-w-[500px] truncate font-medium">
            //     {formatCNPJ(row.getValue('supplier'))}
            //   </span>
            // </div>
            <EditableCell
              className="w-32"
              cell={cell}
              row={row}
              type="cnpj"
              valueName="supplier"
            />
            )
          : (
            <Skeleton className="h-4" />
            )
      )
    },
  },
  {
    accessorKey: 'customer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Empresa" />
    ),
    cell: ({ cell, row }) => {
      return (
        row.getValue('customer')
          ? (
            <EditableCell
              className="w-32"
              cell={cell}
              row={row}
              type="cnpj"
              valueName="customer"
            />
            )
          : <Skeleton className="h-4" />
      )
    },
  },
  {
    accessorKey: 'receiptNumber',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="w-16"
        column={column}
        title="Número"
      />
    ),
    cell: ({ cell, row }) => {
      return (
        row.getValue('receiptNumber')
          ? (
            <EditableCell
              className="w-16"
              cell={cell}
              row={row}
              type="text"
              valueName="receiptNumber"
            />
            )
          : <Skeleton className="h-4" />
      )
    },
  },
  {
    accessorKey: 'receiptValueInCents',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ cell, row }) => {
      return (
        row.getValue('receiptValueInCents')
          ? (
            <EditableCell
              className="w-16"
              cell={cell}
              row={row}
              type="currency"
              valueName="receiptValueInCents"
            />
            )
          : (
            <Skeleton className="h-4" />
            )
      )
    },
  },
  {
    accessorKey: 'issValueInCents',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ISS Retido" />
    ),
    cell: ({ cell, row }) => {
      return (
        row.getValue('issValueInCents')
          ? (
            <EditableCell
              className="w-16"
              cell={cell}
              row={row}
              type="currency"
              valueName="issValueInCents"
            />
            )
          : (
            <Skeleton className="h-4" />
            )
      )
    },
  },
  {
    accessorKey: 'documentType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Documento" />
    ),
    cell: ({ row }) => {
      return (
        row.getValue('documentType')
          ? (
            <div className="flex space-x-2">
              <span className="max-w-[500px] truncate font-medium">
                {row.getValue('documentType')}
              </span>
            </div>
            )
          : (
            <Skeleton className="h-4" />
            )
      )
    },
  },
  {
    accessorKey: 'issueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Emissão" />
    ),
    cell: ({ cell, row }) => {
      return (
        row.getValue('issueDate')
          ? (
            // <div className="flex space-x-2">
            //   <span className="max-w-[500px] truncate font-medium">
            //     {dayjs(row.getValue('issueDate')).format('DD/MM/YYYY')}
            //   </span>
            // </div>
            <EditableCell
              cell={cell}
              row={row}
              type="date"
              valueName="issueDate"
            />
            )
          : (
            <Skeleton className="h-4" />
            )
      )
    },
  },
  {
    accessorKey: 'accrualDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Competência" />
    ),
    cell: ({ cell, row }) => {
      return (
        row.getValue('accrualDate')
          ? (
            <EditableCell
              cell={cell}
              row={row}
              type="date"
              valueName="accrualDate"
            />
            )
          : (
            <Skeleton className="h-4" />
            )
      )
    },
  },

]
