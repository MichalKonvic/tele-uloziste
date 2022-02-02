import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "User must have email"]
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
        default: () => new Date()
    },
    updatedAt: {
        type: Date,
        default: () => new Date()
    }
})
export default mongoose.models.User || mongoose.model('User',userSchema);