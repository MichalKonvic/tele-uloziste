import mongoose from 'mongoose';

const dirSchema = new mongoose.Schema({
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    dirChilds: {
        type: [mongoose.SchemaTypes.ObjectId]
    },
    fileChilds: {
        type: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'file'
        }]
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
        required: true,
        ref: 'user'
    },
})
export default mongoose.models.Dir || mongoose.model('Dir',dirSchema);