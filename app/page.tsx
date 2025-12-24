import { AgendaProvider } from './_providers/AgendaProvider';
import { AgendaInput } from './_components/agenda/AgendaInput';
import { RoleDisplay } from './_components/agenda/RoleDisplay';
import Link from 'next/link'; // Import Link

export default function Home() {
  return (
    <AgendaProvider>
      <div className="flex flex-col items-center px-4 pt-32 pb-16 min-h-screen">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-6xl">📋</span>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Agenda Processor
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Parse meeting agendas and extract role assignments automatically with AI-powered intelligence
            </p>
          </div>
          
          {/* Main Content */}
          <div className="space-y-8">
            <AgendaInput />
            <RoleDisplay />
          </div>
        </div>
      </div>
    </AgendaProvider>
  );
}
