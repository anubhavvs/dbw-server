import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @openapi
 * components:
 *  schemas:
 *    UnauthorizedError:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          example: Not authorized
 *    LogInUserInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: anubhavvsaha2001@gmail.com
 *        password:
 *          type: string
 *          default: 123456aA*
 *    LogInUserOutput:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *          example: Anubhav Saha
 *        email:
 *          type: string
 *          example: anubhavvsaha2001@gmail.com
 *        isAdmin:
 *          type: boolean
 *          example: false
 *        status:
 *          enum: [active, deleted]
 *          example: active
 *        premium:
 *          type: boolean
 *          example: false
 *    AllUsers:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/LogInUserOutput'
 */

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: true,
      default: 'active',
      enum: ['active', 'deleted'],
    },
    premium: {
      type: Boolean,
      required: true,
      default: false,
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
