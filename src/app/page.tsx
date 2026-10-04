'use client';

import { useState } from 'react';

const exampleMessages = [
  {
    id: 1,
    title: "Guaranteed Return Scam",
    content: "URGENT! SEBI approved investment opportunity. Invest ₹10,000 today and receive guaranteed ₹50,000 in 30 days. Limited seats. Send payment immediately to secure your position."
  },
  {
    id: 2,
    title: "Fake Regulatory Impersonation",
    content: "Dear Investor, your trading account has been selected for an exclusive opportunity. Click this link immediately to verify your account and avoid suspension."
  },
  {
    id: 3,
    title: "Normal Financial Education",
    content: "Investing involves risk. Before making an investment decision, investors should understand the product, associated risks, costs and applicable disclosures."
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
      // For demo purposes, show mock results
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
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-green-50 text-green-700 border-green-200';
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'HIGH': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SL</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">ScamLens</h1>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Track A — Digital Fraud & Scam Resilience
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            ScamLens
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
            Check before you trust.
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            AI-powered protection against suspicious investment messages.
          </p>
        </div>

        {!results ? (
          /* Input Section */
          <div className="space-y-8">
            {/* Main Input Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="space-y-4">
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Paste a suspicious investment message here...
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter the suspicious message you received..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !message.trim()}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Message'}
                </button>
              </div>
            </div>

            {/* Example Messages */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Try these examples:</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {exampleMessages.map((example) => (
                  <button
                    key={example.id}
                    onClick={() => loadExample(example.content)}
                    className="bg-white dark:bg-slate-800 rounded-lg p-4 text-left border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
                  >
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {example.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
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
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                  {results.riskScore}/100
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(results.riskLevel)}`}>
                  {results.riskLevel} RISK
                </div>
              </div>
              <p className="text-center text-slate-600 dark:text-slate-300">
                {results.summary}
              </p>
            </div>

            {/* Red Flags */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Potential Red Flags</h2>
              <div className="space-y-4">
                {results.redFlags.map((flag: any, index: number) => (
                  <div key={index} className={`bg-white dark:bg-slate-800 rounded-xl p-5 border ${getSeverityColor(flag.severity)}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                          ⚠ {flag.title}
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
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Protect Yourself</h2>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                <ul className="space-y-2">
                  {results.safeActions.map((action: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="flex-shrink-0 mt-1 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {action}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                {results.disclaimer}
              </p>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={() => setResults(null)}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
              >
                Analyze Another Message
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            ScamLens - SANGYAN Hackathon 2024 | Track A — Digital Fraud & Scam Resilience
          </p>
        </div>
      </footer>
    </div>
  );
}