import mongoose from 'mongoose';
import './user'
import './file'
const dirSchema = new mongoose.Schema({
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    dirChilds: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref:'Dir'
    },
    fileChilds: {
        type: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'File'
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
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
})
export default mongoose.models.Dir || mongoose.model('Dir',dirSchema);