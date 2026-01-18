import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [3, 'Minimum length should be 3']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    minLength: [6, 'Password length should be at least 6'],
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });


// we have used our own function for hashing and matching.
// userSchema.pre("save", async function () {
//   try {
//     if (!this.isModified("password")) return;
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   catch (error) {
//     next(error);
//   }
// });

// userSchema.methods.comparePassword = async function (plainPassword) {
//   return await bcrypt.compare(plainPassword, this.password);
// }

export default model('User', userSchema);