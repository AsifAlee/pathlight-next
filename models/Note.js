import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: function () { return this.type === 'text'; }
    },
    fileUrl: {
        type: String,
        required: function () { return this.type !== 'text'; }
    },
    fileName: {
        type: String,
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file'],
        required: true
    },
    userId: {
        type: String, // Assuming we strictly store the email or auth provider ID, matching User model reference if strict population needed but using String for now based on auth generic
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent overwrite of existing model
export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
