import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        default: 0
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