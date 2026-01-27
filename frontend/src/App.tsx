import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-linear-bg font-sans text-white">
          <header className="border-b border-linear-border/50 sticky top-0 bg-linear-bg/80 backdrop-blur-xl z-50">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-xl font-medium tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                CashFlow <span className="text-linear-accent font-bold">.</span>
              </h1>
              <div className="flex gap-4">
                {/* Space for navigational elements or profile */}
              </div>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
