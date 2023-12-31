import mongoose from 'mongoose';

const weatherSchema = mongoose.Schema({
  datetime: {
    type: Date,
    required: true,
  },
  ghi: {
    type: Number,
    required: true,
  },
  t_ghi: {
    type: Number,
    required: true,
  },
  max_uv: {
    type: Number,
    required: true,
  },
  clouds: {
    type: Number,
    required: true,
  },
  temp: {
    type: Number,
    required: true,
  },
});

const locationSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const productSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    azimuth: {
      type: Number,
      required: true,
    },
    inclination: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    systemLoss: {
      type: Number,
      required: true,
    },
    system: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'System',
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Inactive'],
      default: 'Draft',
    },
    weatherData: {
      type: [weatherSchema],
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
