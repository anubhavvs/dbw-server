import mongoose from 'mongoose';

const logSchema = mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
});

const LogModel = mongoose.model('log', logSchema);

export default LogModel;
