import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    premium: {
      type: Boolean,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    result: {
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model('Project', projectSchema);

export default ProjectModel;
