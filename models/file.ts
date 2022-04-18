import mongoose from 'mongoose';
import './user'
import './dir'
const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    onedriveURL: {
        type: String,
        required: true,
        // TODO link validation
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Dir',
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
    }
})
export default mongoose.models.File || mongoose.model('File',fileSchema);