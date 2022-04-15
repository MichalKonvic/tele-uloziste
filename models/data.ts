import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        default: 0
    },
    childs: {
        type: [mongoose.SchemaTypes.ObjectId]
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
})
export default mongoose.models.Data || mongoose.model('Data',dataSchema);