"use client";

import Card from "@/components/Card";

const CodeExamples = () => {
  return (
    <Card title="Code Examples" className="p-6">
      <h2 className="text-xl font-semibold mb-4">Code Examples</h2>
      <div className="space-y-3">
        <div>
          <h3 className="font-medium mb-2">Basic API Request</h3>
          <pre className="bg-[var(--backgrounds-surface2)] p-4 rounded-lg text-sm overflow-x-auto">
            <code>{`// JavaScript example
const response = await fetch('/api/v1/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});

const users = await response.json();`}</code>
          </pre>
        </div>

        <div>
          <h3 className="font-medium mb-2">React Component Integration</h3>
          <pre className="bg-[var(--backgrounds-surface2)] p-4 rounded-lg text-sm overflow-x-auto">
            <code>{`// React component example
import { DashboardProvider } from '@your-org/dashboard';

function App() {
  return (
    <DashboardProvider apiKey="your-api-key">
      <YourDashboard />
    </DashboardProvider>
  );
}`}</code>
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default CodeExamples;
