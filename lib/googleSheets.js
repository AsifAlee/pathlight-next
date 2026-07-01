const sheetHeaders = [
    "Submitted At",
    "Full Name",
    "Student Email",
    "School",
    "Student Level",
    "Study Focus",
    "Graduation Year",
    "Career Clarity",
    "Career Direction",
    "Decision Timeline",
    "Can Test",
    "Review Notes",
];

export async function appendBetaApplicationToSheet(application) {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
        return { skipped: true, reason: "GOOGLE_SHEETS_WEBHOOK_URL not configured" };
    }

    const row = [
        new Date().toISOString(),
        application.fullName,
        application.studentEmail,
        application.schoolName,
        application.studentStatus,
        application.studyFocus,
        application.graduationYear,
        application.careerClarity,
        application.chosenDirection,
        application.decisionTimeline,
        application.canTestAndFeedback,
        [
            `Confused about: ${application.careerConfusion}`,
            `Wrong path worry: ${application.wrongPathWorry}`,
            `Knows field jobs: ${application.fieldJobKnowledge}`,
            `Advice source: ${application.adviceSource}`,
            `Decision confidence: ${application.decisionConfidence}/5`,
            `Pressure: ${application.feelingPressure}${application.pressureSource ? ` - ${application.pressureSource}` : ""}`,
            `Missed opportunity: ${application.missedOpportunity}`,
            `Right path gives: ${application.rightPathOutcome}`,
            `Previous support: ${application.usedCareerSupport}${application.careerSupportName ? ` - ${application.careerSupportName}` : ""}${application.careerSupportHelped ? ` (${application.careerSupportHelped})` : ""}`,
            `Application ID: ${application._id?.toString() || ""}`,
        ].join("\n"),
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
