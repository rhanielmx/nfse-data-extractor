import React, { useState, type ChangeEvent } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { UploadIcon } from '@radix-ui/react-icons'
import type { ReceiptAsMessage } from '@/data/receipts'
import axios from 'axios'
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
      const socket = new WebSocket('ws://localhost:3337/websocket')
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

  const handleUpload = async () => {
    if (pdfFiles) {
      console.log('-----', pdfFiles)
      for (const file of pdfFiles) {
        console.log(file.arrayBuffer)
      }
      const socket = new WebSocket('ws://localhost:3336/websocket')

      socket.onopen = () => {
        console.log('files', pdfFiles)
        pdfFiles.forEach(file => {
          const fileReader = new FileReader()

          fileReader.readAsArrayBuffer(file)
          fileReader.onload = () => {
            const pdfData = new Uint8Array(fileReader.result as ArrayBuffer)
            socket.send(JSON.stringify(Array.from(pdfData)))
          }
        })
      }

      socket.onmessage = (event) => {
        const { data, error } = JSON.parse(event.data)
        // const parsedData = JSON.parse(data)
        handleStateChange(data)

        if (error) {
          console.error('error', error)
        } else {
          console.log(
            `Received file with:
            ID ${data.id} and status ${data.status}`,
          )
          // sendImageToBackend(image)
        }
      }

      socket.onclose = () => {
        console.log('WebSocket connection closed')
      }
    }
  }

  const handleUploadV3 = () => {
    console.log('inside')
    if (pdfFiles) {
      console.log('---')
      // const api = axios.create({
      //   baseURL: 'http://localhost:3336',
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })

      axios({
        baseURL: 'http://localhost:3338/upload',
        method: 'post',
        data: pdfFiles,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(() => {
        console.log('finished')
      }).catch(err => console.log(err))
    }
  }

  return (
    <div>
      <Input
        type="file"
        className="h-8 w-[150px] lg:w-[250px]"
        onChange={handleFileChange}
        accept="application/pdf"
        name="files"
        multiple
      />
      <Button
        variant="outline"
        className="h-8 w-[150px] lg:w-[250px]"
        onClick={handleUploadV3}
        disabled={!pdfFiles}
      >
        <UploadIcon className="mr-2 w-4 h-4" />
        Importar Notas
      </Button>
    </div>
  )
}
