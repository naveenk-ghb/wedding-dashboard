import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hotel, Plane, Bus, MessageCircle, Phone, Compass, Info, Check, Calculator, ArrowRight } from "lucide-react";

export default function GuestComfort() {
  const [activeTab, setActiveTab] = useState<"hotel" | "uk-travel" | "local-shuttle">("hotel");
  
  // Interactive flight/shuttle lookup state
  const [flightTime, setFlightTime] = useState("");
  const [shuttleRecommendation, setShuttleRecommendation] = useState<string | null>(null);

  const calculateShuttle = () => {
    if (!flightTime) {
      setShuttleRecommendation("Please enter a time to recommend.");
      return;
    }
    const [hoursStr] = flightTime.split(":");
    const hour = parseInt(hoursStr, 10);
    
    if (isNaN(hour)) {
      setShuttleRecommendation("Valid arrival time calculation failed.");
      return;
    }

    if (hour >= 6 && hour < 11) {
      setShuttleRecommendation("🚌 Morning Shuttle (Departs Airport at 11:30 AM) is recommended for your booking!");
    } else if (hour >= 11 && hour < 16) {
      setShuttleRecommendation("🚌 Afternoon Shuttle (Departs Airport at 4:30 PM) matches your arrival!");
    } else if (hour >= 16 && hour < 22) {
      setShuttleRecommendation("🚌 Evening Shuttle (Departs Airport at 10:45 PM) is reserved for your flight!");
    } else {
      setShuttleRecommendation("🚕 Private Cab Service (Requested through Aishu's coordinators) is recommended for late-night arrivals!");
    }
  };

  return (
    <div className="py-10 px-6 sm:px-10 glass-panel-lg rounded-[40px] max-w-4xl mx-auto shadow-2xl shadow-rose-200/40 relative overflow-hidden" id="guest-comfort-section">
      <div className="text-center mb-8">
        <span className="font-script text-3xl text-wedding-magenta block mb-1">
          Travel & Guest Help
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-wedding-burgundy tracking-wide uppercase">
          Guest Comfort Details
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-medium to-transparent mx-auto mt-2"></div>
      </div>

      {/* Tri-Pane tabs */}
      <div className="grid grid-cols-3 gap-1 md:gap-2 bg-white/30 backdrop-blur-md p-1.5 rounded-2xl mb-8 border border-white/40 shadow-xs">
        <button
          onClick={() => setActiveTab("hotel")}
          className={`flex flex-col sm:flex-row items-center gap-1.5 justify-center py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wide transition-all ${
            activeTab === "hotel"
              ? "bg-white/75 backdrop-blur-sm text-wedding-burgundy shadow-sm border border-white/80"
              : "text-rose-950/60 hover:text-wedding-burgundy"
          }`}
          id="tab-comfort-hotel"
        >
          <Hotel className="w-3.5 h-3.5 text-wedding-magenta" />
          <span>India Stay</span>
        </button>
        <button
          onClick={() => setActiveTab("uk-travel")}
          className={`flex flex-col sm:flex-row items-center gap-1.5 justify-center py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wide transition-all ${
            activeTab === "uk-travel"
              ? "bg-white/75 backdrop-blur-sm text-wedding-burgundy shadow-sm border border-white/80"
              : "text-rose-950/60 hover:text-wedding-burgundy"
          }`}
          id="tab-comfort-uk-travel"
        >
          <Plane className="w-3.5 h-3.5 text-wedding-magenta" />
          <span>International</span>
        </button>
        <button
          onClick={() => setActiveTab("local-shuttle")}
          className={`flex flex-col sm:flex-row items-center gap-1.5 justify-center py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wide transition-all ${
            activeTab === "local-shuttle"
              ? "bg-white/75 backdrop-blur-sm text-wedding-burgundy shadow-sm border border-white/80"
              : "text-rose-950/60 hover:text-wedding-burgundy"
          }`}
          id="tab-comfort-shuttle"
        >
          <Bus className="w-3.5 h-3.5 text-wedding-magenta" />
          <span>Local Transfers</span>
        </button>
      </div>

      {/* Pane Content with animations */}
      <div className="min-h-[220px]">
        <AnimatePresence mode="wait">
          {activeTab === "hotel" && (
            <motion.div
              key="hotel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              id="pane-comfort-hotel"
            >
              <div className="md:col-span-7 space-y-4">
                <span className="text-xs uppercase tracking-wider font-bold text-wedding-magenta font-mono">
                  Your Home In India
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-wedding-burgundy">
                  Ramanashree California Resort
                </h3>
                <p className="text-zinc-700 text-sm leading-relaxed font-medium">
                  We are absolutely delighted to provide complimentary accommodation at the serene, premium <strong>Ramanashree California Resort</strong> (Bengaluru) for all our out-of-town and international guests.
                </p>
                
                <div className="backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl p-4 flex gap-3 items-start text-xs text-zinc-700">
                  <Info className="w-4 h-4 text-wedding-magenta shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-wedding-burgundy block">Complimentary Dates:</span>
                    Check-in: November 19, 2026 (12:00 PM onwards)<br />
                    Check-out: November 22, 2026 (11:00 AM)
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <Check className="w-4 h-4 stroke-[3]" /> Warm Swimming Pools
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <Check className="w-4 h-4 stroke-[3]" /> Morning Buffet Breakfast
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <Check className="w-4 h-4 stroke-[3]" /> Gym & Spas
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 backdrop-blur-md bg-white/55 border border-white/80 rounded-2xl p-4 text-center shadow-xs">
                <span className="text-3xl block mb-2">🏨</span>
                <span className="font-serif font-bold text-wedding-burgundy block text-sm">Resort Bookings Taken Care Of</span>
                <p className="text-zinc-650 font-medium text-[11px] mt-1.5 leading-relaxed">
                  No separate booking is needed on your end. Simply mention <strong>Aishu & Dev Wedding</strong> during your entry check-in with your passport or Aadhaar Card.
                </p>
                <div className="mt-4 pt-4 border-t border-white/80">
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono mb-1 font-semibold">Resort Address</span>
                  <p className="text-zinc-800 text-[11px] font-sans font-medium">
                    Ananthapura Gate, Doddaballapur Rd, NH 64, Yelahanka, Bengaluru, 560064
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "uk-travel" && (
            <motion.div
              key="uk-travel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
              id="pane-comfort-uk"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🇬🇧 ✨ 🇮🇳</span>
                <span className="text-xs font-bold font-mono tracking-wider text-wedding-magenta uppercase">
                  Travelers From UK & International
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-wedding-burgundy">
                Seamless International Sourcing
              </h3>
              <p className="text-zinc-700 text-sm leading-relaxed max-w-2xl font-medium">
                We want to make your journey to India as effortless and seamless as possible. We are blocking a limited pool of flight seats at discounted rates for guests flying out of London Heathrow (LHR) directly into Bengaluru Kempegowda Airport (BLR).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="backdrop-blur-md bg-white/40 border border-white/60 p-4 rounded-xl shadow-xs">
                  <span className="text-xs font-bold text-wedding-burgundy block font-serif mb-1">✈️ Flight Block Seat Bookings</span>
                  <p className="text-zinc-650 text-xs leading-relaxed font-medium">
                    Reserve seat tags under our corporate wedding quota. Request your flight interest in the RSVP form by <strong className="text-wedding-magenta font-mono">October 15, 2026</strong>.
                  </p>
                </div>

                <div className="backdrop-blur-md bg-white/40 border border-white/60 p-4 rounded-xl shadow-xs">
                  <span className="text-xs font-bold text-wedding-burgundy block font-serif mb-1">签证 / India Visa Information</span>
                  <p className="text-zinc-650 text-xs leading-relaxed font-medium">
                    British Citizens require an eVisa. It can be easily completed online in 72 hours. Ensure passport validity exceeds 6 months before departure!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "local-shuttle" && (
            <motion.div
              key="local-shuttle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
              id="pane-comfort-shuttle"
            >
              <div className="md:col-span-6 space-y-4">
                <span className="text-xs uppercase tracking-wider font-bold text-wedding-magenta font-mono">
                  Seamless Airport Transfers
                </span>
                <h3 className="font-serif text-xl font-bold text-wedding-burgundy">
                  Event Shuttles & Airport Pickups
                </h3>
                <p className="text-zinc-700 text-xs leading-relaxed font-medium">
                  To ensure you can fully enjoy the festivities without any luggage or route worries, local luxury shuttles will transport you from Kempegowda Airport directly to Ramanashree California Resort, and back during return slots.
                </p>

                <div className="space-y-2 text-xs text-zinc-700 font-sans font-medium">
                  <div className="flex gap-2 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-wedding-magenta"></span>
                    <span>Airport to Ramanashree Resort: ~25 mins distance</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-wedding-magenta"></span>
                    <span>Daily shuttles will run between Ramanashree Resort & Aadya Farms Venue (~10 mins)</span>
                  </div>
                </div>
              </div>

              {/* Shuttle Predictor Tool widget */}
              <div className="md:col-span-6 backdrop-blur-md bg-white/40 border border-white/60 p-4 rounded-2xl relative shadow-sm">
                <span className="absolute -top-2.5 left-4 bg-wedding-magenta text-[#fdf2f0] text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-md">
                  Shuttle Finder Tool
                </span>
                
                <h4 className="font-serif text-xs font-semibold text-wedding-burgundy mb-2 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-wedding-magenta" />
                  What shuttle matches my flight?
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-zinc-650 font-semibold uppercase mb-1">Enter Airport Arrival Time (BLR)</label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={flightTime}
                        onChange={(e) => setFlightTime(e.target.value)}
                        className="bg-white/60 backdrop-blur-sm border border-white/80 focus:border-wedding-magenta focus:bg-white select:outline-none rounded-lg px-2 py-1 text-xs text-zinc-850 flex-1 font-medium"
                      />
                      <button
                        onClick={calculateShuttle}
                        className="px-3 py-1 bg-wedding-burgundy hover:bg-wedding-magenta text-[#fdf2f0] text-[11px] font-semibold uppercase rounded-lg transition-colors flex items-center gap-1 shadow-sm active:scale-95 duration-150 cursor-pointer"
                      >
                        Find <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {shuttleRecommendation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-2.5 backdrop-blur-sm bg-white/70 border border-white rounded-xl text-xs text-wedding-burgundy font-medium font-sans flex items-center gap-2"
                      >
                        <Compass className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="leading-snug">{shuttleRecommendation}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Love Coordination & Contact footer */}
      <div className="mt-8 pt-6 border-t border-white/40 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <p className="text-zinc-605 text-[11px] leading-relaxed font-sans text-center sm:text-left font-medium">
          Need help with local transport, check-in, or flights? Please do not hesitate to ping our family coordinators directly!
        </p>
        <div className="flex justify-center sm:justify-end gap-3">
          <a
            href="https://wa.me/447787106672"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-full shadow-sm transition-transform active:scale-95"
            title="Chat on WhatsApp with Bride Aishwarya"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Chat: Aishwarya (+44 UK)</span>
          </a>
          <a
            href="tel:+447787106672"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/55 hover:bg-white text-wedding-burgundy border border-white/80 text-xs font-semibold rounded-full transition-transform active:scale-95 shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-wedding-magenta" />
            <span>Call</span>
          </a>
        </div>
      </div>
    </div>
  );
}
