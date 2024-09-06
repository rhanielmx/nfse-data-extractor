import { DataTable } from '@/components/data-table'
import { ReceiptsUploader } from '@/components/receipts-uploader'

import { columns } from '@/data/columns'
import { type ReceiptAsMessage } from '@/data/receipts'
import { useState } from 'react'

export default function Home() {
  const [receipts, setReceipts] = useState<ReceiptAsMessage[]>([])
  // const [files, setFiles] = useState<FileList>()

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setFiles(e.target.files)
  //   }
  // }

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

      {receipts.length > 0
        ? (
          <DataTable data={receipts} columns={columns} />
          )
        : (
          <section className="flex flex-col flex-1 items-center justify-center">
            <ReceiptsUploader onReceiptsChange={setReceipts} />
          </section>
          )}

    </main>
  )
}
