import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { RiMenu3Line } from 'react-icons/ri';
import { Detail } from "./components/Detail";
import Landing from './components/Landing';
import Tv from './components/Tv';
import Sidebar from './components/Sidebar';
import Search from './components/Search';
import TvDetail from './components/TvDetail';
import SeasonDetail from './components/SeasonDetail';

import MoviesState from './context/movies/MoviesState';
import TvState from './context/tv/TvState';

import "./App.css";
import Footer from "./components/Footer";

function LegacyMovieRedirect() {
  const { id, title } = useParams();

  return <Navigate to={`/movies/${id}/${title}`} replace />;
}

function App() {
  const [connection, setConnection] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const goOffline = () => setConnection(false);
    const goOnline = () => setConnection(true);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!connection) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#27292c] px-4 py-10">
        <div className="double-shell w-full max-w-xl">
          <div className="double-core px-8 py-14 text-center sm:px-12">
            <span className="luxury-badge mx-auto mb-5 w-fit">
              <span className="eyebrow-dot" />
              Offline state
            </span>
            <h1 className="headline-gradient text-5xl sm:text-6xl">You&apos;re offline</h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#979bb2]">
              Reconnect to keep browsing films, series, cast, trailers, and discovery lists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MoviesState>
      <TvState>
        <Router basename={process.env.PUBLIC_URL} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="relative min-h-[100dvh] overflow-hidden bg-[#27292c] text-[#f5f6fb]">
            <div className="pointer-events-none fixed inset-0 z-0">
              <div className="absolute inset-y-0 left-0 hidden w-[19rem] bg-[#242526] lg:block" />
            </div>

            <div className="relative z-10 min-h-[100dvh]">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              <div className="relative flex min-h-[100dvh] flex-col lg:pl-[19rem]">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#242526]/95 text-[#f5f6fb] shadow-[0_12px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl lg:hidden"
                  aria-label="Open navigation"
                >
                  <RiMenu3Line size={20} />
                </button>

                <main className="flex-1 px-4 pb-8 pt-16 sm:px-5 lg:px-8 lg:pt-6">
                  <Routes>
                    <Route path="/" element={<Navigate to="/movies" replace />} />
                    <Route path="/movies" element={<Landing />} />
                    <Route path="/tv" element={<Tv />} />
                    <Route path="/movies/:id/:title" element={<Detail />} />
                    <Route path="/movie/:id/:title" element={<LegacyMovieRedirect />} />
                    <Route path="/tv/:id/:title" element={<TvDetail />} />
                    <Route path="/tv/:id/:title/season/:seasonNumber/:seasonTitle" element={<SeasonDetail />} />
                    <Route path="/search" element={<Search />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </div>
          </div>
        </Router>
      </TvState>
    </MoviesState>
  );
}

export default App;
