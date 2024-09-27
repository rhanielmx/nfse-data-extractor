import { z } from 'zod'

export const receiptSchema = z.object({
  id: z.string().uuid(),
  supplier: z.string(),
  customer: z.string(),
  number: z.number(),
  receiptValueInCents: z.number(),
  issValueInCents: z.number(),
  issueDate: z.string(),
  accrualDate: z.string(),
  documentType: z.number(),
  operationCode: z.number(),
  status: z.string(),
  items: z.array(z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    purpose: z.number(),
    costCenter: z.number(),
    activity: z.number(),
    quantity: z.number(),
    unitPriceInCents: z.number(),
  })),
})

export type Receipt = z.infer<typeof receiptSchema>

export type ReceiptAsMessage =
  Partial<Omit<Receipt, 'id' | 'status'>>
  & Pick<Receipt, 'id' | 'status'>

export const receipts = z.array(receiptSchema).parse(
  Array.from({ length: 50 }, (_, index) => {
    return {
      id: '9d9fa39c-9cf4-40ad-ab5f-de5674e27c8b',
      supplier: '39756256000169',
      customer: '02974336000342',
      number: index,
      receiptValueInCents: 10500,
      iss: 0,
      issueDate: '09/08/2024',
      accrualDate: '09/08/2024',
      documentType: 77,
      operationCode: 1079,
      status: 'processing',
    }
  }))
