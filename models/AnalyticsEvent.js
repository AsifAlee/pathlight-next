import mongoose from 'mongoose';

const AnalyticsEventSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        default: null,
    },
    userEmail: {
        type: String,
        default: null,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

// Index for fast queries by event type and user
AnalyticsEventSchema.index({ event: 1, createdAt: -1 });
AnalyticsEventSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.AnalyticsEvent ||
    mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
