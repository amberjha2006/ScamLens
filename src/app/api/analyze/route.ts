import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are ScamLens, an AI-powered fraud detection system for investment-related messages. Analyze the provided text and identify potential fraud indicators.

IMPORTANT: You are NOT providing investment advice. You are only identifying potential fraud indicators and providing safety guidance.

Return your analysis in STRICT JSON format with the following structure:
{
  "riskLevel": "LOW | MEDIUM | HIGH",
  "riskScore": 0-100,
  "summary": "A brief explanation of the analysis",
  "redFlags": [
    {
      "title": "Short descriptive title of the red flag",
      "severity": "LOW | MEDIUM | HIGH",
      "evidence": "Exact or short excerpt from the message that shows this indicator",
      "explanation": "Why this may be suspicious and what to look for"
    }
  ],
  "safeActions": [
    "Action item 1",
    "Action item 2",
    "Action item 3"
  ],
  "disclaimer": "This analysis identifies potential fraud indicators and does not provide investment advice."
}

Look for these common fraud indicators:
- Guaranteed or unusually high returns
- Urgency or pressure to act immediately
- Impersonation of SEBI, banks, government organizations, brokers
- Requests for OTP, PIN, passwords or sensitive credentials
- Requests to transfer money to unusual accounts
- Suspicious payment instructions
- Fake authority claims
- Suspicious links/domains
- Fake investment schemes
- Promises of risk-free profits
- Social engineering tactics
- Fear or urgency tactics
- Requests to communicate through unofficial channels

Use cautious language like:
- "potential fraud indicators"
- "high-risk characteristics"
- "appears suspicious"
- "verify independently"

NEVER automatically label something as a confirmed scam. Always use language that indicates this is an analysis of potential risks.`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // Return mock response if API key is not configured
      return Response.json({
        riskLevel: "MEDIUM",
        riskScore: 65,
        summary: "Unable to perform AI analysis. Please configure OpenAI API key for full analysis.",
        redFlags: [
          {
            title: "Analysis Limited",
            severity: "MEDIUM",
            evidence: "No API key configured",
            explanation: "AI analysis requires OpenAI API key configuration for full fraud detection capabilities."
          }
        ],
        safeActions: [
          "Be cautious with any investment opportunity",
          "Verify through official channels",
          "Seek advice from registered financial advisors"
        ],
        disclaimer: "This analysis identifies potential fraud indicators and does not provide investment advice."
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Analyze this investment-related message for potential fraud indicators:\n\n${message}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      // Parse the JSON response
      const parsed = JSON.parse(response);
      return Response.json(parsed);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);

      // Fallback to a structured response if parsing fails
      return Response.json({
        riskLevel: "MEDIUM",
        riskScore: 50,
        summary: "Unable to fully analyze the message due to processing error.",
        redFlags: [
          {
            title: "Processing Error",
            severity: "MEDIUM",
            evidence: "Message analysis incomplete",
            explanation: "The system encountered an error while analyzing this message."
          }
        ],
        safeActions: [
          "Be cautious with the message content",
          "Verify information through official sources",
          "Seek professional advice if needed"
        ],
        disclaimer: "This analysis identifies potential fraud indicators and does not provide investment advice."
      });
    }
  } catch (error) {
    console.error('Error in analysis:', error);

    // Return a safe error response
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
      disclaimer: "This analysis identifies potential fraud indicators and does not provide investment advice."
    }, { status: 500 });
  }
}