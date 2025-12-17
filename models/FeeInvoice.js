import mongoose from "mongoose";


const feeInvoiceSchema = new mongoose.Schema(
{
school: {
type: mongoose.Schema.Types.ObjectId,
ref: "School",
required: true,
index: true
},
student: {
type: mongoose.Schema.Types.ObjectId,
ref: "Student",
required: true
},
invoiceNumber: {
type: String,
unique: true
},
term: {
type: String,
enum: ["First Term", "Second Term", "Third Term"],
required: true
},
breakdown: [
{
fee: { type: mongoose.Schema.Types.ObjectId, ref: "Fee" },
title: String,
amount: Number
}
],
totalAmount: { type: Number, required: true },
status: {
type: String,
enum: ["unpaid", "partial", "paid"],
default: "unpaid"
},
dueDate: Date
},
{ timestamps: true }
);


feeInvoiceSchema.pre("save", async function (next) {
if (!this.invoiceNumber) {
const count = await mongoose.model("FeeInvoice").countDocuments();
this.invoiceNumber = `INV-${Date.now()}-${count + 1}`;
}
next();
});


export default mongoose.model("FeeInvoice", feeInvoiceSchema);