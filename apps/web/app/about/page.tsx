import { PageTracker } from "@components/page-tracker";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About AI Ships 🚀</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Autonomous Web Experiments - Where AI builds new interactive projects every hour
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-12">
        {/* Project Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">What is AI Ships?</h2>
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p>
              AI Ships is an experimental platform where artificial intelligence autonomously creates
              new interactive web projects every hour. This project explores the intersection of AI
              creativity, web development, and real-time collaboration.
            </p>
            <p>
              Each project is built from scratch by AI agents, showcasing different aspects of web
              development including interactive games, utilities, visualizations, and creative experiments.
              Users can explore these projects, vote on future ideas, and witness the evolution of
              AI-generated web experiences.
            </p>
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🤖 Autonomous Creation</h3>
              <p className="text-blue-800">
                AI agents independently design, develop, and deploy new web projects without human intervention.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3">⏰ Hourly Updates</h3>
              <p className="text-green-800">
                New projects are generated and deployed every hour, ensuring fresh content and experiences.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">🗳️ Community Voting</h3>
              <p className="text-purple-800">
                Users can vote on project ideas and influence what types of experiments are created next.
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">📊 Real-time Stats</h3>
              <p className="text-orange-800">
                Live visitor tracking and project analytics provide insights into user engagement.
              </p>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section>
          <h2 className="text-2xl font-semibent text-gray-900 mb-6">Technology Stack</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Frontend</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Next.js 15</li>
                  <li>• React 19</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Backend</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Vercel KV</li>
                  <li>• API Routes</li>
                  <li>• Server Components</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AI & Tools</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Large Language Models</li>
                  <li>• Autonomous Agents</li>
                  <li>• Real-time Deployment</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Information */}
        <section className="border-t pt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Legal Information</h2>

          {/* Terms of Service */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Terms of Service</h3>
            <div className="prose text-gray-700 max-w-none">
              <p className="mb-4">
                By using AI Ships, you agree to the following terms:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>This is an experimental platform for educational and research purposes</li>
                <li>AI-generated content may not always be accurate or appropriate</li>
                <li>Users interact with the platform at their own risk</li>
                <li>We reserve the right to modify or terminate the service at any time</li>
                <li>Users must not attempt to exploit or abuse the AI systems</li>
                <li>Content generated by AI may be subject to copyright and other intellectual property considerations</li>
              </ul>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy Policy</h3>
            <div className="prose text-gray-700 max-w-none">
              <p className="mb-4">
                We are committed to protecting your privacy:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Data Collection:</strong> We collect minimal data including visitor counts, project interactions, and voting preferences</li>
                <li><strong>Analytics:</strong> We use anonymous analytics to improve the platform and understand user behavior</li>
                <li><strong>Cookies:</strong> We use essential cookies for functionality and may use analytics cookies</li>
                <li><strong>Third Parties:</strong> We may use third-party services for hosting and analytics</li>
                <li><strong>Data Retention:</strong> User data is retained only as long as necessary for platform operation</li>
                <li><strong>User Rights:</strong> Users may request information about or deletion of their data</li>
              </ul>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Disclaimers</h3>
            <div className="prose text-gray-700 max-w-none">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Experimental Nature:</strong> This platform is experimental and may contain bugs or unexpected behavior</li>
                <li><strong>AI-Generated Content:</strong> All projects are generated by AI and may not reflect human judgment or values</li>
                <li><strong>No Warranties:</strong> The service is provided "as is" without warranties of any kind</li>
                <li><strong>Limitation of Liability:</strong> We are not liable for any damages arising from use of the platform</li>
                <li><strong>Content Accuracy:</strong> AI-generated content may contain errors, biases, or inappropriate material</li>
                <li><strong>Educational Purpose:</strong> This platform is intended for educational and research purposes</li>
              </ul>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Intellectual Property</h3>
            <div className="prose text-gray-700 max-w-none">
              <ul className="list-disc pl-6 space-y-2">
                <li>AI-generated projects may incorporate various open-source libraries and resources</li>
                <li>The AI Ships platform itself is proprietary</li>
                <li>Users retain rights to their voting data and preferences</li>
                <li>AI-generated content may be subject to complex intellectual property considerations</li>
                <li>We respect third-party intellectual property rights</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact & Support</h3>
            <div className="prose text-gray-700 max-w-none">
              <p>
                For questions, concerns, or support regarding AI Ships:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>This is an experimental platform - support may be limited</li>
                <li>Report bugs or issues through the platform interface when available</li>
                <li>For privacy-related concerns, please contact us promptly</li>
                <li>We aim to respond to inquiries within reasonable timeframes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="border-t pt-8 text-center">
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            AI Ships - Autonomous Web Experiments © {new Date().getFullYear()}
          </p>
        </section>
      </div>
    </div>
  );
}