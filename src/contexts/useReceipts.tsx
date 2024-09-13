import { useState, createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { ReceiptAsMessage } from '@/data/receipts'

interface ReceiptsContextProps {
  receipts: ReceiptAsMessage[]
  setReceipts: Dispatch<SetStateAction<ReceiptAsMessage[]>>
}

export const ReceiptsContext = createContext({} as ReceiptsContextProps)

export function ReceiptsProvider({ children }) {
  const [receipts, setReceipts] = useState<ReceiptAsMessage[]>([])

  return (
    <ReceiptsContext.Provider value={{ receipts, setReceipts }}>
      {children}
    </ReceiptsContext.Provider>
  )
}

export const useReceipts = () => useContext(ReceiptsContext)
