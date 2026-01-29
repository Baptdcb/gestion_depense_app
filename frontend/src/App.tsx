import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/Sidebar";
import SettingsModal from "./components/SettingsModal";
import { useState } from "react";
import { FaCog } from "react-icons/fa";

function App() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="flex h-screen bg-linear-bg font-sans text-white overflow-hidden">
          <Sidebar onSelectMonth={setSelectedMonth} />
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <header className="border-b border-linear-border/50 sticky top-0 bg-linear-bg/80 backdrop-blur-xl z-50">
              <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-xl font-medium tracking-tight bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent">
                  CashFlow{" "}
                  <span className="text-linear-accent font-bold">.</span>
                </h1>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 text-white/50 hover:text-white transition-colors"
                  >
                    <FaCog size={20} />
                  </button>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto w-full">
              <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                      />
                    }
                  />
                </Routes>
                <SettingsModal
                  isOpen={isSettingsOpen}
                  onClose={() => setIsSettingsOpen(false)}
                />
              </div>
            </main>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
