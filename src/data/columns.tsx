import type { ColumnDef } from '@tanstack/react-table'
import type { Receipt, ReceiptAsMessage } from './receipts'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table-colum-header'

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
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatCNPJ(row.getValue('supplier'))}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'customer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Empresa" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatCNPJ(row.getValue('customer'))}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'number',
    header: ({ column }) => (
      <DataTableColumnHeader className="min-w-fit w-[48px]" column={column} title="Número" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('number')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'receiptValueInCents',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {((row.getValue('receiptValueInCents') ?? 0) / 100)
              .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'issValueInCents',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ISS Retido" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {((row.getValue('issValueInCents') ?? 0) / 100)
              .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
          </span>
        </div>
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
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('documentType')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'issueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Emissão" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('issueDate')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'accrualDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Competência" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('accrualDate')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('status')}
          </span>
        </div>
      )
    },
    enableHiding: false,
    enableSorting: false,
  },
]
