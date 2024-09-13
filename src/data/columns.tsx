import type { Cell, ColumnDef, Row } from '@tanstack/react-table'
import type { ReceiptAsMessage } from './receipts'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table-colum-header'
import { Skeleton } from '@/components/ui/skeleton'

import { UploadIcon, ClockIcon, CheckCircledIcon } from '@radix-ui/react-icons'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br.js'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useReceipts } from '@/contexts/useReceipts'
dayjs.locale('pt-br')

function formatCNPJ(cnpj:string) {
  // Remove all non-digit characters
  if (!cnpj) {
    return '00.000.000/0000-00'
  }
  const cleanedCNPJ = cnpj.replace(/\D/g, '')

  // Check if the cleaned CNPJ has the correct length
  if (cleanedCNPJ.length !== 14) {
    throw new Error('CNPJ must contain 14 digits.')
  }

  // Format the CNPJ
  const formattedCNPJ = cleanedCNPJ.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5',
  )

  return formattedCNPJ
}

const statuses = {
  processing: { label: 'Processando', icon: ClockIcon },
  done: { label: 'Pronto', icon: CheckCircledIcon },
}

const defaultStatus = { label: 'Enviando', icon: UploadIcon }

interface EditableCellProps {
  cell: Cell<ReceiptAsMessage, unknown>
  row: Row<ReceiptAsMessage>
  type: 'text' | 'cnpj' | 'currency' | 'date'
  valueName: string
}

const EditableCell = (
  { cell, row, type = 'text', valueName }:EditableCellProps,
) => {
  const { receipts, setReceipts } = useReceipts()
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] =
    useState<string | number>(cell.getValue<string | number>())

  const handleSave = (receiptId:string) => {
    const indexOfFocusedReceipt = receipts
      .findIndex((receipt) => receipt.id === receiptId)

    const existingReceipts = [...receipts]
    existingReceipts[indexOfFocusedReceipt] = {
      ...receipts[indexOfFocusedReceipt],
      [valueName]: value,
    }
    setReceipts(existingReceipts)
    setIsEditing(false)
  }

  const format = {
    text: (value: string) => value,
    cnpj: (value: string) => formatCNPJ(value),
    currency: (value: number) => ((value ?? 0) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }),
    date: (value: string) => dayjs(value).format('DD/MM/YYYY'),
  }

  return (
    isEditing
      ? (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlurCapture={() => handleSave(row.original.id)}
        />
        )
      : (
        <div className="flex space-x-2" onClick={() => setIsEditing(true)}>
          <span className="max-w-[500px] truncate font-medium">
            {format[type](row.getValue(valueName))}
          </span>
        </div>
        )
  )
}

export const columns: ColumnDef<ReceiptAsMessage>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    enableSorting: false,
    enableHiding: false,
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
        className="min-w-fit w-[48px]"
        column={column}
        title="Número"
      />
    ),
    cell: ({ cell, row }) => {
      return (
        row.getValue('receiptNumber')
          ? (
            <EditableCell
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
    enableHiding: false,
    enableSorting: false,
  },
]
