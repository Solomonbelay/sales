const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, trim: true, lowercase: true },
  productService: { type: String, required: true },
  salesValue: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'], 
    default: 'Lead' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);