/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Sparkles, Calendar, MapPin, ChevronDown } from "lucide-react";
import AudioPlayer from "./components/AudioPlayer";
import Countdown from "./components/Countdown";
import Itinerary from "./components/Itinerary";
import GuestComfort from "./components/GuestComfort";
import RsvpForm from "./components/RsvpForm";
import WishesWall from "./components/WishesWall";
import { RsvpSubmission } from "./types";

export default function App() {
  const [submissionsCount, setSubmissionsCount] = useState(0);

  // Triggered when a guest submits a new RSVP. Helps trigger live state refresh in app.
  const handleNewSubmission = (sub: RsvpSubmission) => {
    setSubmissionsCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#fdf2f0] text-charcoal-deep font-sans selection:bg-wedding-pink-medium selection:text-wedding-burgundy relative overflow-x-hidden watercolor-radial-1">
      {/* Background Mesh Decorative Glow Circles from Design HTML */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-rose-200 rounded-full blur-[90px] sm:blur-[130px] opacity-65 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] bg-orange-100 rounded-full blur-[100px] sm:blur-[150px] opacity-75 pointer-events-none z-0"></div>
      <div className="absolute top-[35%] left-[10%] w-[400px] sm:w-[800px] h-[300px] sm:h-[450px] bg-white opacity-40 blur-[80px] sm:blur-[110px] pointer-events-none z-0"></div>

      {/* Decorative Floral background overlay at the top left */}
      <div className="absolute top-0 left-0 w-48 sm:w-72 h-48 sm:h-72 opacity-15 pointer-events-none z-0">
        <svg viewBox="0 0 200 200" fill="currentColor" className="text-wedding-pink-dark">
          <path d="M0,0 C40,40 100,50 120,0 C100,40 40,80 0,120 Z" />
          <path d="M0,40 C30,70 80,60 100,20 C80,50 40,90 0,140 Z" />
          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      
      <div className="absolute bottom-0 right-0 w-48 sm:w-72 h-48 sm:h-72 opacity-15 pointer-events-none z-0">
        <svg viewBox="0 0 200 200" fill="currentColor" className="text-wedding-pink-dark rotate-180">
          <path d="M0,0 C40,40 100,50 120,0 C100,40 40,80 0,120 Z" />
          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Elegant Frosted Glass Navigation Bar */}
      <nav className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-6 flex justify-between items-center" id="nav-bar">
        <div className="text-wedding-burgundy font-serif italic text-2xl tracking-tighter">A&D</div>
        <div className="hidden md:flex gap-8 text-wedding-burgundy/80 text-xs font-semibold uppercase tracking-widest">
          <a href="#countdown-section-anchor" className="hover:text-wedding-magenta transition-colors">Invitation</a>
          <a href="#itinerary-section" className="hover:text-wedding-magenta transition-colors">Itinerary</a>
          <a href="#guest-comfort-section" className="hover:text-wedding-magenta transition-colors">Travel Info</a>
          <a href="#wishes-guestbook-section" className="hover:text-wedding-magenta transition-colors">Wishes book</a>
        </div>
        <button 
          onClick={() => {
            const el = document.getElementById("rsvp-section-anchor");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-6 py-2.5 bg-wedding-burgundy hover:bg-wedding-magenta text-[#fdf2f0] rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-rose-200/50 transition-all active:scale-95 cursor-pointer"
        >
          RSVP NOW
        </button>
      </nav>

      {/* Hero Invitation / Welcome Screen */}
      <header className="relative flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4 py-8 text-center max-w-4xl mx-auto z-10" id="invitation-hero">
        
        {/* Subtle romantic badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-white hover:bg-wedding-pink-light/45 border border-gold-medium/40 rounded-full text-[10px] md:text-xs font-bold text-wedding-magenta tracking-widest uppercase mb-6 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Save The Week
        </motion.div>

        {/* Primary quote */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-xs md:text-sm tracking-widest uppercase text-wedding-burgundy/80 font-semibold mb-4"
        >
          Two Hearts. Two Cultures. One Journey
        </motion.p>

        {/* Large custom stylized name calligraphies (Matching style of invitation PDF page 1) */}
        <div className="relative py-4 pr-2 sm:pr-8 pl-2 w-full max-w-md select-none mb-4">
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Elegant Name Layout with gigantic custom style calligraphy letters */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative flex items-center justify-center gap-1 flex-wrap"
            >
              {/* Huge 'A' Glyphs and stacking text name */}
              <span className="font-script text-7xl sm:text-9xl text-wedding-magenta font-extralight pr-1">A</span>
              <span className="font-serif text-3xl sm:text-4xl text-wedding-burgundy tracking-widest uppercase align-middle mt-4 -ml-4">ISHWARYA</span>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-script text-3xl text-wedding-magenta block my-2"
            >
              and
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative flex items-center justify-center gap-1 flex-wrap"
            >
              {/* Huge 'D' Glyph and stacking text name */}
              <span className="font-script text-7xl sm:text-9xl text-wedding-magenta pr-1">D</span>
              <span className="font-serif text-3xl sm:text-4xl text-wedding-burgundy tracking-widest uppercase align-middle mt-4 -ml-4">EV</span>
            </motion.div>
          </div>
        </div>

        {/* Sincere subheadings */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-serif text-sm sm:text-md text-zinc-600 font-medium mb-6 max-w-md"
        >
          together with their families, invite you to their wedding celebration
        </motion.p>

        {/* Core Date & Location */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="space-y-2 border-y border-gold-medium/30 py-4 px-8 mb-8"
        >
          <span className="font-sans text-xs uppercase tracking-widest block text-zinc-500 font-semibold">November</span>
          <span className="font-serif text-4xl sm:text-5xl font-extrabold text-wedding-magenta block tracking-tight">20-21</span>
          <span className="font-sans text-xs uppercase tracking-widest block text-wedding-burgundy font-bold">2026</span>
          <span className="font-serif text-sm sm:text-md uppercase block tracking-wider font-bold text-zinc-700 flex items-center justify-center gap-1">
            <MapPin className="w-4 h-4 text-wedding-magenta inline" /> Bengaluru, India
          </span>
        </motion.div>

        {/* Formal info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="font-script text-xl text-wedding-magenta tracking-wide mb-10"
        >
          Formal Invite to Follow
        </motion.p>

        {/* Floating Sound Controller and Down Scroll Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col items-center gap-8 w-full max-w-sm"
        >
          <AudioPlayer />
          
          <button
            onClick={() => {
              const el = document.getElementById("countdown-section-anchor");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="animate-bounce flex flex-col items-center gap-1 opacity-70 hover:opacity-100 text-wedding-burgundy pointer duration-300"
            title="Scroll for wedding details"
            id="scroll-down-btn"
          >
            <span className="text-[10px] tracking-widest uppercase font-mono font-medium">Scroll down</span>
            <ChevronDown className="w-4 h-4 text-wedding-magenta" />
          </button>
        </motion.div>
      </header>

      {/* Main content body wrap */}
      <main className="relative space-y-12 pb-24 z-10 watercolor-radial-2">
        
        {/* Countdown Wall module */}
        <section className="scroll-mt-6" id="countdown-section-anchor">
          <Countdown />
        </section>

        {/* Celebration Events Schedule */}
        <section className="px-4">
          <Itinerary />
        </section>

        {/* Accommodation hotels and local guideline */}
        <section className="px-4">
          <GuestComfort />
        </section>

        {/* Interactive RSVP Registration Form */}
        <section className="px-4" id="rsvp-section">
          <RsvpForm onNewSubmission={handleNewSubmission} />
        </section>

        {/* Bleesings guest feedback card wall */}
        <section className="px-4 whitespace-nowrap overflow-x-hidden md:whitespace-normal">
          <WishesWall />
        </section>

      </main>

      {/* Sincere elegant footer */}
      <footer className="relative bg-wedding-burgundy text-cream-soft text-center py-12 px-4 border-t border-gold-medium/20 z-10" id="page-footer">
        {/* Watercolor bloom layout overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,204,213,0.05)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="max-w-xl mx-auto space-y-4 relative">
          <span className="text-2xl">💍</span>
          <h3 className="font-script text-white text-4xl block">With Love</h3>
          <p className="font-serif text-sm italic text-zinc-300 max-w-sm mx-auto leading-relaxed">
            "We can't wait to celebrate with you!"
          </p>

          <p className="font-sans text-xs text-wedding-pink-medium/70 uppercase tracking-widest pt-4 border-t border-white/10 mt-6">
            Aishwarya Naveen & Dev • 2026 Bengaluru • +44 7787 106672
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">
            Designed for desktop & mobile devices with beautiful micro-animations
          </p>
        </div>
      </footer>
    </div>
  );
}
