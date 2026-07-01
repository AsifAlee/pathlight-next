const sheetHeaders = [
    "Submitted At",
    "Full Name",
    "Student Status",
    "School",
    "Study Focus",
    "Graduation Year",
    "Student Email",
    "Career Clarity",
    "Chosen Direction",
    "Wrong Path Worry",
    "Career Confusion",
    "Field Job Knowledge",
    "Used Career Support",
    "Career Support Name",
    "Career Support Helped",
    "Advice Source",
    "Decision Confidence",
    "Feeling Pressure",
    "Pressure Source",
    "Decision Timeline",
    "Missed Opportunity",
    "Right Path Outcome",
    "Can Test And Feedback",
    "Application ID",
];

export async function appendBetaApplicationToSheet(application) {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
        return { skipped: true, reason: "GOOGLE_SHEETS_WEBHOOK_URL not configured" };
    }

    const row = [
        new Date().toISOString(),
        application.fullName,
        application.studentStatus,
        application.schoolName,
        application.studyFocus,
        application.graduationYear,
        application.studentEmail,
        application.careerClarity,
        application.chosenDirection,
        application.wrongPathWorry,
        application.careerConfusion,
        application.fieldJobKnowledge,
        application.usedCareerSupport,
        application.careerSupportName || "",
        application.careerSupportHelped || "",
        application.adviceSource,
        application.decisionConfidence,
        application.feelingPressure,
        application.pressureSource || "",
        application.decisionTimeline,
        application.missedOpportunity,
        application.rightPathOutcome,
        application.canTestAndFeedback,
        application._id?.toString() || "",
    ];

    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            type: "beta_application",
            headers: sheetHeaders,
            row,
            application,
        }),
    });

    if (!response.ok) {
        throw new Error(`Google Sheets webhook failed with status ${response.status}`);
    }

    return { skipped: false };
}
