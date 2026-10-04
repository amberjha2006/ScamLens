const fraudIndicators = [
  { pattern: /guaranteed\s+return|guaranteed\s+profit|unusually\s+high\s+returns/i, score: 30, title: "Guaranteed returns", severity: "HIGH", explanation: "Guaranteed or unusually high returns are a common warning sign in fraudulent investment messages." },
  { pattern: /otp|pin|password|credentials/i, score: 30, title: "Sensitive credential request", severity: "HIGH", explanation: "Requests for OTPs, PINs, passwords, or banking credentials are common in fraudulent messages." },
  { pattern: /payment|transfer\s+request|send\s+money/i, score: 25, title: "Payment request", severity: "HIGH", explanation: "Requests to transfer money are common in fraudulent investment messages." },
  { pattern: /sebi|bank|government\s+organization/i, score: 25, title: "Impersonation", severity: "HIGH", explanation: "Impersonation of regulatory bodies or financial institutions is a common fraud tactic." },
  { pattern: /risk-free|no-risk/i, score: 25, title: "Risk-free claim", severity: "MEDIUM", explanation: "Risk-free or no-risk claims are common in fraudulent investment messages." },
  { pattern: /unusually\s+high\s+return/i, score: 25, title: "Unusually high return", severity: "MEDIUM", explanation: "Unusually high returns are a common warning sign in fraudulent investment messages." },
  { pattern: /suspicious\s+link|account\s+verification\s+link/i, score: 20, title: "Suspicious link", severity: "MEDIUM", explanation: "Suspicious links or account verification requests are common in fraudulent messages." },
  { pattern: /urgent|act\s+immediately|limited\s+time|limited\s+slots/i, score: 15, title: "Urgency", severity: "MEDIUM", explanation: "Urgency tactics are common in fraudulent investment messages." }
];

const safeActions = [
  "Do not transfer money based solely on this message.",
  "Do not share OTPs, PINs, passwords, or banking credentials.",
  "Avoid clicking suspicious links.",
  "Verify the organization independently using official contact information.",
  "If fraud is suspected, use appropriate official reporting channels."
];

const educationalSafeActions = [
  "Understand the investment product thoroughly before making a decision.",
  "Consider the associated risks, costs, and disclosures.",
  "Seek advice from a registered financial advisor if needed."
];

function analyzeMessage(message: string) {
  let score = 0;
  const redFlags = [];

  for (const indicator of fraudIndicators) {
    if (indicator.pattern.test(message)) {
      const match = message.match(indicator.pattern);
      if (match) {
        score += indicator.score;
        redFlags.push({
          title: indicator.title,
          severity: indicator.severity,
          evidence: match[0],
          explanation: indicator.explanation
        });
      }
    }
  }

  // Cap score at 100
  score = Math.min(score, 100);

  let riskLevel = "LOW";
  if (score >= 50) {
    riskLevel = "HIGH";
  } else if (score >= 25) {
    riskLevel = "MEDIUM";
  }

  let summary = "This message appears to be a normal financial education message.";
  if (riskLevel !== "LOW") {
    summary = `This message contains potential fraud indicators. It has characteristics commonly associated with investment scams. Verify independently before taking action.`;
  }

  return {
    riskLevel,
    riskScore: score,
    summary,
    redFlags,
    safeActions: riskLevel === "LOW" ? educationalSafeActions : safeActions,
    disclaimer: "ScamLens identifies potential fraud indicators. It does not provide investment advice, stock recommendations, or predictions."
  };
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return Response.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const analysis = analyzeMessage(message);
    return Response.json(analysis);
  } catch (error) {
    console.error('Error in analysis:', error);
    return Response.json({
      riskLevel: "MEDIUM",
      riskScore: 40,
      summary: "Error occurred during analysis. Please try again.",
      redFlags: [
        {
          title: "Analysis Error",
          severity: "LOW",
          evidence: "Technical issue detected",
          explanation: "The system encountered an error while processing your request."
        }
      ],
      safeActions: [
        "Try analyzing the message again",
        "Check your internet connection",
        "Contact support if the issue persists"
      ],
      disclaimer: "ScamLens identifies potential fraud indicators. It does not provide investment advice, stock recommendations, or predictions."
    }, { status: 500 });
  }
}