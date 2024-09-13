import { DataTable } from '@/components/data-table'
import { ReceiptsUploader } from '@/components/receipts-uploader'

import { columns } from '@/data/columns'
import { ReceiptsContext, useReceipts } from '@/contexts/useReceipts'
import { useContext, useEffect, useState } from 'react'

export default function Home() {
  const { receipts, setReceipts } = useContext(ReceiptsContext)
  const [tableSize, setTableSize] = useState(0)

  // useEffect(() => {
  //   setReceipts([])
  // }, [setReceipts])

  const handleTeste = (id: string) => {
    const indexToChange = receipts.findIndex((receipt) => receipt.id === id)

    if (indexToChange !== -1) {
      const currentReceipts = [...receipts]
      // const updatedReceipt = { ...currentReceipts, issValueInCents: 100 }
      currentReceipts[indexToChange] = {
        ...currentReceipts[indexToChange],
        issValueInCents: 12345,
      }
      setReceipts(currentReceipts)
    }
  }

  return (
    <main className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Olá, usuário!</h2>
          <p className="text-muted-foreground">
            Veja abaixo as suas notas de serviço a serem processadas!
          </p>
        </div>
      </div>
      <DataTable
        data={receipts.length > 0
          ? receipts
          : Array(tableSize).fill({})}
        columns={columns}
        handleClick={console.log}
      />
      {receipts.length === 0 && (
        <section className="flex flex-col flex-1 items-center justify-center">
          <ReceiptsUploader
            onReceiptsChange={setReceipts}
            setTableSize={setTableSize}
          />

        </section>
      )}
    </main>
  )
}
