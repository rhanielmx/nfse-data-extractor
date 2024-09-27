import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Button } from './ui/button'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import type { Row } from '@tanstack/react-table'
import type { ReceiptAsMessage } from '@/data/receipts'
import { EditableItemCell } from './editable-cell'
import { useReceipts } from '@/contexts/useReceipts'
import { v4 as uuidv4 } from 'uuid'

export function RenderSubcomponent({ row }: { row: Row<ReceiptAsMessage> }) {
  const { receipts, setReceipts } = useReceipts()

  const handleCreateItem = (rowId: string) => {
    const receiptIndex = receipts.findIndex((receipt) => receipt.id === rowId)

    const existingReceipts = [...receipts]
    const existingItems = existingReceipts[receiptIndex].items

    existingItems?.push({
      id: uuidv4(),
      code: '0',
      name: 'Novo Objeto',
      activity: 37,
      costCenter: 3,
      purpose: 3,
      quantity: 0,
      unitPriceInCents: 0,

    })

    existingReceipts[receiptIndex] = {
      ...receipts[receiptIndex],
      items: existingItems,
    }

    setReceipts(existingReceipts)
  }

  const handleDeleteItem = (rowId: string, itemId: string) => {
    const receiptIndex = receipts
      .findIndex((receipt) => receipt.id === rowId)
    const itemIndex = receipts[receiptIndex]
      .items?.findIndex((item) => item.id === itemId)

    if (itemIndex === -1) {
      return
    }

    const existingReceipts = [...receipts]
    const existingItems = existingReceipts[receiptIndex].items

    const filteredItems = existingItems?.filter((item) => item.id !== itemId)

    existingReceipts[receiptIndex] = {
      ...receipts[receiptIndex],
      items: filteredItems,
    }

    setReceipts(existingReceipts)
  }

  return (
    <Table className="pl-4">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Button
              variant="link"
              className="mx-auto"
              onClick={() => handleCreateItem(row.original.id)}
            >
              <PlusIcon />
            </Button>
          </TableHead>
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
        {row.original.items?.map((item) => {
          return (
            <TableRow key={item.id}>
              <TableCell className="flex items-center justify-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleDeleteItem(row.original.id, item.id)}
                >
                  <TrashIcon />
                </Button>
              </TableCell>
              <TableCell>
                <EditableItemCell
                  item={item}
                  row={row}
                  type="text"
                  valueName="code"
                />
              </TableCell>
              <TableCell>
                <EditableItemCell
                  item={item}
                  row={row}
                  type="text"
                  valueName="name"
                />
              </TableCell>
              <TableCell>
                <EditableItemCell
                  item={item}
                  row={row}
                  type="text"
                  valueName="purpose"
                />
              </TableCell>
              <TableCell>
                <EditableItemCell
                  item={item}
                  row={row}
                  type="text"
                  valueName="costCenter"
                />
              </TableCell>
              <TableCell>
                <EditableItemCell
                  item={item}
                  row={row}
                  type="text"
                  valueName="activity"
                />
              </TableCell>
              <TableCell>
                <EditableItemCell
                  item={item}
                  row={row}
                  type="text"
                  valueName="quantity"
                />
              </TableCell>
              <TableCell>
                <EditableItemCell
                  item={item}
                  row={row}
                  type="currency"
                  valueName="unitPriceInCents"
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
