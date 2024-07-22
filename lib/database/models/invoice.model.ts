import mongoose, { Schema, models } from 'mongoose'
const invoiceSchema = new Schema({
    customer: {
        type: Object,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: "unpaid"
    },
    sent: {
        type: Number,
        default: 0,
        required: true
    }
}, { timestamps: true })

export const Invoice = models.Invoice || mongoose.model("Invoice", invoiceSchema)

