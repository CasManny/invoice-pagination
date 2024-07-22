"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../connectDB"
import { Invoice } from "../models/invoice.model"
import Error from "next/error"

interface IFormdata {
    formdata: {
        amount: number,
        status: string,
        name: string,
        customer: {
            id: string,
            name: string,
            email: string,
        }
    }
}
interface IParams {
    params: {
        page: string,
        limit: string,
        search: string,
    }

}


export const createInvoice = async ({ formdata }: IFormdata) => {
    const { amount, status, name, customer } = formdata
   
    try {
       
        await connectToDatabase()
        const newInvoice = new Invoice({
            customer,
            amount,
            status,
        })
        await newInvoice.save()
        revalidatePath('/')
        return { message: "invoice created successfully"}
    } catch (error) {
     console.log("Failded to create invoice")   
    }

}

export const getInvoices = async ({ params }: IParams) => {
    const page = parseInt(params?.page) || 1
    const limit = parseInt(params?.limit) || 10
    const skip = (page - 1) * limit

    const searchQuery = params?.search
    ? {
        $or: [
            { amount: { $regex: params?.search, $options: 'i' } },
            { status: { $regex: params?.search, $options: 'i' } },
            { "customer.name": { $regex: params?.search, $options: 'i' } },
            { "customer.email": { $regex: params?.search, $options: 'i' } },
        ],
      }
    : {};

    try {
        await connectToDatabase()
        const invoices = await Invoice.find(searchQuery).skip(skip).limit(limit)
        const totalCount = await Invoice.countDocuments(searchQuery)
        const pageCount = Math.ceil(totalCount / limit)

        return JSON.stringify({
            totalCount,
            pageCount,
            data: invoices
        })
    } catch (error) {
        console.log(error)
    }
}