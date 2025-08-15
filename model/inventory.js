// models/InventoryLog.js
const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Which product
    quantity: { type: Number, required: true },            // How much
    action: { type: String, enum: ['assign',], required: true }, // Action performed
    status: { type: String, enum: ['Pending', 'Cleared'], default: 'Pending' }, // Stock status
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who did it
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // If assigned to employee
    jobworker: { type: mongoose.Schema.Types.ObjectId, ref: 'JobWorker' }, // If assigned to employee
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },     // If vendor involved
    firm: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' }, // For multi-firm support
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InventoryLog', InventoryLogSchema);
