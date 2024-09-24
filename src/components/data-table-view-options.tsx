'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

const COLUMN_TITLE_MAPPER: Record<string, string> = {
  supplier: 'Fornecedor',
  customer: 'Empresa',
  receiptNumber: 'Número',
  issueDate: 'Data de Emissão',
  accrualDate: 'Data de Competência',
  receiptValueInCents: 'Valor',
  issValueInCents: 'ISS Retido',
  documentType: 'Tipo de Documento',
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          Visualizar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuLabel>Alternar visualização</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {COLUMN_TITLE_MAPPER[column.id]}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
