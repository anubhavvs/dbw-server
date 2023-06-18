import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Company',
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cellType: {
      type: String,
      required: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    efficiency: {
      type: Number,
      required: true,
    },
    warrantyYears: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
