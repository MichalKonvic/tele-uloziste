import mongoose from 'mongoose';

const getCurDate = () => {
    return new Date().getTime();
}

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
        default: () => Date(),
    },
    updatedAt: {
        type: Date,
    },
    lastLoginAt: {
        type: Date,
    },
})
export default mongoose.models.User || mongoose.model('User',userSchema);