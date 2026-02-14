import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/50 -z-20"></div>

      {/* Decorative Orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob -z-10 translate-x-[-50%] translate-y-[-50%]"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 -z-10 translate-x-[50%] translate-y-[-50%]"></div>

      <Dashboard />
    </div>
  );
}

export default App;
