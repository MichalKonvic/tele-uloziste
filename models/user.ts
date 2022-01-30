import mongoose from 'mongoose';

const validateEmail = (email: string): boolean => {
    return /(.*)\.(.*)@teleinformatika\.eu/.test(email);
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "User must have email"],
        validate: [validateEmail,"Email didnt pass the check"],
        match:[/(.*)\.(.*)@teleinformatika\.eu/,"Email didnt pass the check"]
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