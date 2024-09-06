import React, { useState, type ChangeEvent } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { UploadIcon } from '@radix-ui/react-icons'
import type { ReceiptAsMessage } from '@/data/receipts'

interface ReceiptsUploaderProps {
  onReceiptsChange: React.Dispatch<React.SetStateAction<ReceiptAsMessage[]>>
}

export function ReceiptsUploader({ onReceiptsChange } : ReceiptsUploaderProps) {
  const [pdfFiles, setPdfFiles] = useState<File[] | null>(null)
  // const [ws, setWs] = useState<WebSocket | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return
    }

    const files = Array.from(event.target.files)
      .filter(file => file.type === 'application/pdf')

    if (files) {
      setPdfFiles(files)
    } else {
      alert('Please select a valid PDF file.')
    }
  }

  const handleStateChange = (receivedData: ReceiptAsMessage[]) => {
    // const parsedData:ReceiptAsMessage = JSON.parse(receivedData)
    receivedData.forEach((data) => {
      onReceiptsChange((previousReceipts) => {
        const existingReceiptIndex =
          previousReceipts.findIndex(receipt => receipt.id === data.id)

        if (existingReceiptIndex !== -1) {
          const updatedState = [...previousReceipts]
          updatedState[existingReceiptIndex] = data
          return updatedState
        } else {
          return [...previousReceipts, data]
        }
      })
    },
    )
  }

  const handleUploadV2 = () => {
    if (pdfFiles) {
      const socket = new WebSocket('ws://localhost:3336/websocket')
      socket.onopen = () => {
        const filePromises = Array.from(pdfFiles).map(file => {
          return new Promise((resolve, reject) => {
            const fileReader = new FileReader()

            fileReader.onload = () => {
              const data = fileReader.result as ArrayBuffer
              const pdfData = new Uint8Array(data)
              resolve(JSON.stringify({
                filename: file.name,
                data: Array.from(pdfData),
                length: data.byteLength,
              }))
            }

            fileReader.onerror = reject
            fileReader.readAsArrayBuffer(file)
          })
        })
        Promise.all(filePromises).then(fileDataArray => {
          socket.send(JSON.stringify({ type: 'v2', files: fileDataArray }))
        })
      }

      socket.onmessage = (event) => {
        const { data, error } = JSON.parse(event.data)
        console.log(data)

        if (error) {
          console.error('error', error)
        } else {
          handleStateChange(data)

          // console.log(
          //   `Received file with:
          //   ID ${data.id} and status ${data.status}`,
          // )
          // sendImageToBackend(image)
        }
      }
    }
  }

  const handleUpload = () => {
    if (pdfFiles) {
      const socket = new WebSocket('ws://localhost:3336/websocket')

      socket.onopen = () => {
        console.log('Socket Opened')
        // pdfFiles.forEach(file => {
        //   const fileReader = new FileReader()

        //   fileReader.readAsArrayBuffer(file)
        //   fileReader.onload = () => {
        //     const pdfData = new Uint8Array(fileReader.result as ArrayBuffer)
        //     socket.send(JSON.stringify(Array.from(pdfData)))
        //   }
        // })
      }

      socket.onmessage = (event) => {
        const { data, error } = JSON.parse(event.data)
        // const parsedData = JSON.parse(data)

        if (error) {
          console.error('error', error)
        } else {
          handleStateChange(data)
          // console.log(
          //   `Received file with:
          //   ID ${data.id} and status ${data.status}`,
          // )
          // sendImageToBackend(image)
        }
      }

      socket.onclose = () => {
        console.log('WebSocket connection closed')
      }
    }
  }

  return (
    <form encType="multipart/form-data">
      <Input
        type="file"
        className="h-8 w-[150px] lg:w-[250px]"
        onChange={handleFileChange}
        name="pdfs"
        accept="application/pdf"
        multiple
      />
      <Button
        variant="outline"
        className="h-8 w-[150px] lg:w-[250px]"
        onClick={handleUploadV2}
        disabled={!pdfFiles}
      >
        <UploadIcon className="mr-2 w-4 h-4" />
        Importar Notas
      </Button>
    </form>
  )
}
