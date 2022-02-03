import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "User must have email"],
        lowercase: true,
        unique: [true, "User with this email already exists"]
    },
    password: {
        type: String,
        required: [true, "User must have password"]
    },
    permissionsToken: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        immutable: true,
        required: true,
        default: () => Date(),
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    lastLoginAt: {
        type: Date,
        required: true,
    },
})
export default mongoose.models.User || mongoose.model('User',userSchema);