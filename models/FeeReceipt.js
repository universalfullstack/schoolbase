import mongoose from "mongoose";


const feeReceiptSchema = new mongoose.Schema(
{
school: {
type: mongoose.Schema.Types.ObjectId,
ref: "School",
required: true,
index: true
},
payment: {
type: mongoose.Schema.Types.ObjectId,
ref: "FeePayment",
required: true
},
receiptNumber: {
type: String,
unique: true
},
issuedAt: {
type: Date,
default: Date.now
}
},
{ timestamps: true }
);


feeReceiptSchema.pre("save", async function (next) {
if (!this.receiptNumber) {
const count = await mongoose.model("FeeReceipt").countDocuments();
this.receiptNumber = `RCT-${Date.now()}-${count + 1}`;
}
next();
});


export default mongoose.model("FeeReceipt", feeReceiptSchema);