import { AgendaProvider } from './_providers/AgendaProvider';
import { AgendaInput } from './_components/agenda/AgendaInput';
import { RoleDisplay } from './_components/agenda/RoleDisplay';
import Link from 'next/link'; // Import Link

export default function Home() {
  return (
    <AgendaProvider>
      <div className="flex flex-col items-center p-6 mt-4">
        <div className="w-full max-w-2xl space-y-8">
          <AgendaInput />
          <RoleDisplay />

          {/* New Navigation Link to Timer */}
          <div className="mt-8 text-center">
            <Link href="/timer" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Go to Smart Timer
            </Link>
          </div>
        </div>
      </div>
    </AgendaProvider>
  );
}
