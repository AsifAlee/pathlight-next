import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "counselor"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const transcriptSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    sessionId: {
        type: String,
        required: false,
    },
    personaId: {
        type: String,
        required: false,
    },
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Transcript = mongoose.models.Transcript || mongoose.model("Transcript", transcriptSchema);

export default Transcript;
