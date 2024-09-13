import React, { useEffect, useState, type ChangeEvent } from 'react'
import axios from 'axios'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { UploadIcon } from '@radix-ui/react-icons'
import type { ReceiptAsMessage } from '@/data/receipts'

interface ReceiptsUploaderProps {
  onReceiptsChange: React.Dispatch<React.SetStateAction<ReceiptAsMessage[]>>
  setTableSize: React.Dispatch<React.SetStateAction<number>>
}

interface HandleStateChangeUpload {
  kind: 'UPLOAD'
  data: ReceiptAsMessage[]
}

interface HandleStateChangeProcess {
  kind: 'PROCESS'
  data: ReceiptAsMessage
}

type HandleStateChangeProps = HandleStateChangeUpload | HandleStateChangeProcess

export function ReceiptsUploader({ onReceiptsChange, setTableSize } : ReceiptsUploaderProps) {
  const [pdfFiles, setPdfFiles] = useState<File[] | null>(null)
  useEffect(() => {
    const socket = new WebSocket(`ws://${import.meta.env.VITE_BASE_URL}/websocket`)
    socket.onopen = () => {
      console.log('Connected')
      socket.onmessage = (event) => {
        const { kind, data } = JSON.parse(event.data)
        handleStateChange({ data, kind })
      }
    }
  }, [pdfFiles])

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

  const handleStateChange = ({ data, kind }: HandleStateChangeProps) => {
    switch (kind) {
      case 'UPLOAD':
        data.forEach((d) => {
          onReceiptsChange((previousReceipts) => {
            const existingReceiptIndex =
              previousReceipts.findIndex(receipt => {
                return receipt.id === d.id
              })
            if (existingReceiptIndex !== -1) {
              const updatedState = [...previousReceipts]
              updatedState[existingReceiptIndex] = d
              return updatedState
            } else {
              return [...previousReceipts, d]
            }
          })
        })
        break
      case 'PROCESS':
        onReceiptsChange((previousReceipts) => {
          const existingReceiptIndex =
          previousReceipts.findIndex(receipt => {
            return receipt.id === data.id
          })
          if (existingReceiptIndex !== -1) {
            const updatedState = [...previousReceipts]
            updatedState[existingReceiptIndex] = data
            return updatedState
          } else {
            return [...previousReceipts, data]
          }
        })
        break
    }
  }

  const handleUploadV2 = () => {
    if (pdfFiles) {
      const socket = new WebSocket(`ws://${import.meta.env.VITE_BASE_URL}/websocket`)
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
      const socket = new WebSocket(`ws://${import.meta.env.VITE_BASE_URL}/websocket`)

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
      setTableSize(pdfFiles.length)
      console.log('---')
      axios({
        baseURL: `http://${import.meta.env.VITE_BASE_URL}/upload`,
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
