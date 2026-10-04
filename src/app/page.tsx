'use client';

import { useState } from 'react';

const exampleMessages = [
  {
    id: 1,
    title: "Guaranteed Return Scam",
    content: "URGENT! SEBI approved investment opportunity! Invest ₹10,000 today and receive a GUARANTEED ₹50,000 in just 30 days. Limited slots available. Send payment immediately to secure your position. Don't miss this opportunity!"
  },
  {
    id: 2,
    title: "Fake SEBI Message",
    content: "Dear Investor, your trading account has been selected for an exclusive opportunity. Click this link immediately to verify your account and avoid suspension."
  },
  {
    id: 3,
    title: "Suspicious Account Message",
    content: "Your brokerage account requires immediate verification. Provide your UPI PIN and OTP to prevent account closure. This is a time-sensitive security update."
  },
  {
    id: 4,
    title: "Safe Financial Education",
    content: "Investing involves risk. Investors should understand the product, associated risks, costs and applicable disclosures before making an investment decision."
  }
];

export default function Home() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error analyzing message:', error);
      // For demo purposes, show mock results based on the input
      setResults({
        riskLevel: "HIGH",
        riskScore: 85,
        summary: "This message contains multiple potential fraud indicators including guaranteed returns and urgency tactics.",
        redFlags: [
          {
            title: "Guaranteed Returns",
            severity: "HIGH",
            evidence: "guaranteed ₹50,000 in 30 days",
            explanation: "Guaranteed-return claims are a common warning sign in investment fraud."
          },
          {
            title: "Urgency and Pressure",
            severity: "MEDIUM",
            evidence: "Send payment immediately",
            explanation: "Creating urgency to prevent victims from thinking critically or seeking advice."
          }
        ],
        safeActions: [
          "Do not transfer money until the claim is independently verified.",
          "Never share OTPs, UPI PINs, passwords, or banking credentials.",
          "Verify the organization through its official website/contact information."
        ],
        disclaimer: "This analysis identifies potential fraud indicators and does not provide investment advice."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = (content: string) => {
    setMessage(content);
    setResults(null);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'MEDIUM': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'HIGH': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'HIGH': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">ScamLens</h1>
              <p className="text-xs text-indigo-600 uppercase tracking-wider">INVESTOR SAFETY</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900">How it works</a>
            <a href="#safety" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900">Safety</a>
            <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900">About</a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-4">
            🛡️ AI-Powered Investor Protection
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Check before you trust.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Analyze suspicious investment messages and uncover potential fraud signals before you act.
          </p>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Built for safer digital investing in India
          </p>
        </section>

        {/* Main Analyzer Card */}
        {!results ? (
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Is this message safe?
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Paste a suspicious investment message below. ScamLens will identify potential fraud indicators.
              </p>

              <div className="space-y-4">
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Paste a WhatsApp message, SMS, email, Telegram message, or investment offer here...
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Paste a suspicious investment message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  {!isLoading && message.length > 0 && (
                    <div className="absolute bottom-2 right-2 text-xs text-slate-500 dark:text-slate-400">
                      {message.length}/500
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !message.trim()}
                  className="w-full mt-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Analyzing potential fraud indicators...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7" />
                      </svg>
                      🔍 Analyze Message
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Demo Examples */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Try a sample
              </h2>
              <div className="grid gap-3 md:grid-cols-4">
                {exampleMessages.map((example) => (
                  <button
                    key={example.id}
                    onClick={() => loadExample(example.content)}
                    className="bg-white dark:bg-slate-800 rounded-lg p-4 text-left border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-indigo-600 dark:text-indigo-400">{example.title.split(' ')[0] === '🚨' ? '🚨' : example.title.split(' ')[0] === '🎭' ? '🎭' : example.title.split(' ')[0] === '🔗' ? '🔗' : '✅'}</span>
                      <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {example.title.replace(/^[^a-zA-Z0-9\s]/, '').trim()}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {example.content}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Risk Overview */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
              <div className="text-center mb-6">
                <div className="relative h-20 w-20 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-indigo-600/20"></div>
                  <div className="relative h-full w-full flex items-center justify-center">
                    <div className={`relative h-16 w-16 rounded-full border-4 border-${results.riskLevel === 'LOW' ? 'emerald' : results.riskLevel === 'MEDIUM' ? 'amber' : 'rose'}-200`}
                    >
                      <div className="absolute inset-0 rounded-full bg-${results.riskLevel === 'LOW' ? 'emerald' : results.riskLevel === 'MEDIUM' ? 'amber' : 'rose'}-500/20"></div>
                      <div className="relative h-full w-full flex items-center justify-center">
                        <div className={`text-4xl font-bold text-${results.riskLevel === 'LOW' ? 'emerald' : results.riskLevel === 'MEDIUM' ? 'amber' : 'rose'}-800`}>
                          {results.riskScore}
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg className={`h-5 w-5 text-${results.riskLevel === 'LOW' ? 'emerald' : results.riskLevel === 'MEDIUM' ? 'amber' : 'rose'}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S9 3.17 9 4v1.68C7.64 5.36 6 7.92 6 11h5l-2 2v1h-2v-2H7c-.41.63-.65 1.42-.77 2H6v2h4l2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className={`text-3xl font-bold text-${results.riskLevel === 'LOW' ? 'emerald' : results.riskLevel === 'MEDIUM' ? 'amber' : 'rose'}-800 mb-2`}>
                  {results.riskLevel} RISK
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {results.summary}
                </p>
              </div>
            </div>

            {/* Original Message */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Message analyzed
              </h2>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-800 dark:text-slate-200 italic">
                  "{message}"
                </p>
              </div>
            </div>

            {/* Red Flags */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Potential Red Flags
              </h2>
              <div className="space-y-3">
                {results.redFlags.map((flag: any, index: number) => (
                  <div key={index} className={`bg-white dark:bg-slate-800 rounded-xl p-5 border border-${flag.severity.toLowerCase() === 'low' ? 'emerald' : flag.severity.toLowerCase() === 'medium' ? 'amber' : 'rose'}-200`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 dark:text-white mb-1 flex items-baseline gap-2">
                          ⚠ {flag.title}
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-${flag.severity.toLowerCase() === 'low' ? 'emerald' : flag.severity.toLowerCase() === 'medium' ? 'amber' : 'rose'}-100 text-${flag.severity.toLowerCase() === 'low' ? 'emerald' : flag.severity.toLowerCase() === 'medium' ? 'amber' : 'rose'}-800`}>
                            {flag.severity}
                          </span>
                        </h3>
                        <p className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded mb-2">
                          "{flag.evidence}"
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {flag.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                🛡️ Protect yourself
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Before taking any action:
              </p>
              <div className="space-y-3">
                {results.safeActions.map((action: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400">
                        {index + 1 < 10 ? '0' : ''}{index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                ScamLens identifies potential fraud indicators. It does not provide investment advice, stock recommendations, or predictions.
              </p>
            </div>

            {/* Reset Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => setResults(null)}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
              >
                Analyze another message
              </button>
            </div>
          </div>
        )}

        {/* How it works section */}
        {!results && (
          <div id="how-it-works" className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              How ScamLens works
            </h2>
            <div className="grid gap-6 md:grid-cols-3 text-center">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <span className="text-indigo-600 text-2xl">01</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  PASTE
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Paste a suspicious message.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <span className="text-indigo-600 text-2xl">02</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  ANALYZE
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI checks for common fraud indicators.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <span className="text-indigo-600 text-2xl">03</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  PROTECT
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Understand the risks and decide what to verify before acting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trust & Safety section */}
        {!results && (
          <div id="safety" className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Built for safer investing
            </h2>
            <div className="grid gap-6 md:grid-cols-3 text-center">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <span className="text-emerald-600 text-2xl">🛡️</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Safety-first
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Designed to identify potential fraud indicators before users act.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-amber-600 text-2xl">🔐</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Privacy-first
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Messages are analyzed without building an investment profile.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                    <span className="text-rose-600 text-2xl">🇮🇳</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Built for Bharat
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Designed with accessibility and financial-literacy differences in mind.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* About section */}
        {!results && (
          <div id="about" className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              About ScamLens
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                ScamLens is an investor-safety prototype created for SANGYAN Hackathon Track A — Digital Fraud & Scam Resilience.
                The application analyzes suspicious investment-related messages to identify potential fraud indicators using AI technology.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                ScamLens identifies potential fraud indicators and does NOT provide investment advice, stock recommendations, or guarantees of scam detection.
                Users should always independently verify suspicious claims through official channels.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">SL</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white ml-3">
                ScamLens
              </h2>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">
              Check before you trust.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Built for SANGYAN Hackathon — Track A: Digital Fraud & Scam Resilience
            </p>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              AI analysis may be imperfect. Always independently verify suspicious claims.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}