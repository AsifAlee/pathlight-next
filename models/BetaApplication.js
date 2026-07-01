import mongoose from 'mongoose';

const BetaApplicationSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    studentStatus: {
        type: String,
        required: true,
        enum: ['High school', 'College', 'University', 'Recent graduate', 'Not a student'],
    },
    schoolName: { type: String, required: true, trim: true, maxlength: 180 },
    studyFocus: { type: String, required: true, trim: true, maxlength: 240 },
    graduationYear: { type: String, required: true, trim: true, maxlength: 40 },
    studentEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
    },
    careerClarity: { type: Number, required: true, min: 1, max: 5 },
    chosenDirection: { type: String, required: true, enum: ['Yes, firmly', 'Somewhat', 'Not at all'] },
    wrongPathWorry: { type: String, required: true, enum: ['Never', 'Sometimes', 'Often'] },
    careerConfusion: { type: String, required: true, trim: true, maxlength: 280 },
    fieldJobKnowledge: { type: String, required: true, enum: ['Yes', 'Only some', 'No'] },
    usedCareerSupport: { type: String, required: true, enum: ['No', 'Yes'] },
    careerSupportName: { type: String, trim: true, maxlength: 180 },
    careerSupportHelped: { type: String, enum: ['Yes', 'A little', 'No', 'Not applicable'], default: 'Not applicable' },
    adviceSource: { type: String, required: true, enum: ['Family', 'Friends', 'Teacher', 'Internet', 'No one'] },
    decisionConfidence: { type: Number, required: true, min: 1, max: 5 },
    feelingPressure: { type: String, required: true, enum: ['No', 'Yes'] },
    pressureSource: { type: String, trim: true, maxlength: 180 },
    decisionTimeline: { type: String, required: true, enum: ['Now', 'This year', '1-2 years', 'Not sure'] },
    missedOpportunity: { type: String, required: true, enum: ['Yes', 'No'] },
    rightPathOutcome: { type: String, required: true, trim: true, maxlength: 280 },
    canTestAndFeedback: { type: String, required: true, enum: ['Yes', 'No'] },
    status: { type: String, enum: ['new', 'reviewing', 'approved', 'declined'], default: 'new' },
}, {
    timestamps: true,
});

BetaApplicationSchema.index({ studentEmail: 1 }, { unique: true });
BetaApplicationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.BetaApplication || mongoose.model('BetaApplication', BetaApplicationSchema);
