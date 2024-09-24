import { DataTable } from '@/components/data-table'
import { ReceiptsUploader } from '@/components/receipts-uploader'

import { columns } from '@/data/columns'
import { ReceiptsContext } from '@/contexts/useReceipts'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { receipts, setReceipts } = useContext(ReceiptsContext)
  const [tableSize, setTableSize] = useState(0)
  const [isButtonDisabled, setIsButtonDisable] = useState(false)

  const [userInfo, setUserInfo] = useState({ username: '', hostname: '' })

  useEffect(() => {
    fetch('http://localhost:3333/api/userinfo')
      .then((response) => response.json())
      .then((data) => {
        setUserInfo(data)
        console.log(data)
      })
  }, [])

  return (
    <main className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Olá, {userInfo?.hostname}!
          </h2>
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
        handleButtonDisable={setIsButtonDisable}
      />
      <section className="flex flex-col flex-1 items-center justify-center">
        {(receipts.length === 0)
          ? (
            <ReceiptsUploader
              onReceiptsChange={setReceipts}
              setTableSize={setTableSize}
            />
            )
          : (
            <Button
              disabled={isButtonDisabled}
              onClick={() => console.log(isButtonDisabled)}
            >
              Enviar Notas
            </Button>
            )}
      </section>
    </main>
  )
}
