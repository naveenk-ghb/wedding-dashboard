import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, MapPin, Sparkles, Music, Heart, Award, ArrowRight } from "lucide-react";

interface EventItem {
  time: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  dressCode: string;
}

export default function Itinerary() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  // Day 1 events (November 20)
  const day1Events: EventItem[] = [
    {
      time: "17:00",
      title: "Engagement Entry & Shandy Reception",
      desc: "Receive warm traditional welcomes with jasmine flowers, rosewater, and custom cocktails under the floral canopy.",
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      dressCode: "Traditional / Indo-Western Fusion"
    },
    {
      time: "18:30",
      title: "Ring exchange & Sagan Ceremony",
      desc: "Watch our two hearts officially bind in ring exchange under the canopy, accompanied by parental prayers and light music.",
      icon: <Heart className="w-5 h-5 text-wedding-pink-dark" />,
      dressCode: "Traditional / Indo-Western Fusion"
    },
    {
      time: "19:30",
      title: "Sangeet Extravaganza & Dance Battles",
      desc: "Vibrant custom choreography by family and friends, showcasing a lovely dance duel between Team Bride & Team Groom!",
      icon: <Music className="w-5 h-5 text-indigo-500" />,
      dressCode: "Vibrant ethnic festive wear"
    },
    {
      time: "21:00",
      title: "Cocktail Gala Dinner",
      desc: "Delectable multi-cuisine food tables from Southern India to Continental favourites with a live dessert chef corner.",
      icon: <Award className="w-5 h-5 text-emerald-500" />,
      dressCode: "Vibrant festive / dance friendly"
    }
  ];

  // Day 2 events (November 21)
  const day2Events: EventItem[] = [
    {
      time: "09:30",
      title: "Baraat assembly & Grand Entry",
      desc: "Join Dev in his joyful wedding procession, accompanied by high-energy live dhol performance and dancing cousins.",
      icon: <Music className="w-5 h-5 text-red-500" />,
      dressCode: "Traditional Royal Splendor"
    },
    {
      time: "10:30",
      title: "Wedding Vows & Phere (Muhurtham)",
      desc: "Under the beautiful mandap near the lotus pond, Aishu and Dev exchange ancient vows as the sun marks mid-morning blessings.",
      icon: <Heart className="w-5 h-5 text-wedding-magenta" />,
      dressCode: "Traditional Royal Splendor"
    },
    {
      time: "13:00",
      title: "Royal Feast (Traditional Sadya)",
      desc: "Relish an authentic multi-course celebratory lunch served on fresh plantain leaves — the absolute highlight of local culinary art.",
      icon: <Award className="w-5 h-5 text-orange-500" />,
      dressCode: "Traditional Royal Splendor"
    },
    {
      time: "18:30",
      title: "Grand Reception & Toast Celebrations",
      desc: "An evening of modern romance: cake cutting, heartfelt toasts from the wedding party, and dancing together as Mr. & Mrs.",
      icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
      dressCode: "Black Tie / Tuxedos & Formal Gowns"
    }
  ];

  const currentEvents = activeDay === 1 ? day1Events : day2Events;

  return (
    <div className="py-10 px-6 sm:px-10 glass-panel-lg rounded-[40px] max-w-4xl mx-auto shadow-2xl shadow-rose-200/40 relative overflow-hidden" id="itinerary-section">
      <div className="text-center mb-8">
        <span className="font-script text-3xl text-wedding-magenta block mb-1">
          The Celebration
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-wedding-burgundy tracking-wide uppercase">
          Itinerary of Joy
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-medium to-transparent mx-auto mt-2"></div>
      </div>

      {/* Modern Day Toggle Buttons */}
      <div className="flex justify-center gap-3 mb-10">
        <button
          onClick={() => setActiveDay(1)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-sm border ${
            activeDay === 1
              ? "bg-wedding-magenta text-[#fdf2f0] border-wedding-magenta scale-105"
              : "bg-white/50 backdrop-blur-md text-wedding-burgundy border-white/60 hover:bg-white"
          }`}
          id="itinerary-day1-tab"
        >
          <Calendar className="w-4 h-4" />
          <span>Day 1 • Nov 20</span>
        </button>
        <button
          onClick={() => setActiveDay(2)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-sm border ${
            activeDay === 2
              ? "bg-wedding-magenta text-[#fdf2f0] border-wedding-magenta scale-105"
              : "bg-white/50 backdrop-blur-md text-wedding-burgundy border-white/60 hover:bg-white"
          }`}
          id="itinerary-day2-tab"
        >
          <Calendar className="w-4 h-4" />
          <span>Day 2 • Nov 21</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Timeline column */}
        <div className="md:col-span-7 relative">
          {/* Timeline Center vertical line */}
          <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-wedding-pink-medium via-wedding-pink-dark to-wedding-pink-medium"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, x: activeDay === 1 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeDay === 1 ? 20 : -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {currentEvents.map((item, index) => (
                <div key={index} className="flex gap-4 group" id={`timeline-item-${index}`}>
                  {/* Event Icon with active dot */}
                  <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 border-wedding-pink-medium text-wedding-magenta shadow-sm group-hover:border-wedding-magenta transition-colors duration-300">
                    {item.icon}
                  </div>

                  {/* Bubble body Card */}
                  <div className="flex-1 backdrop-blur-md bg-white/45 border border-white/60 hover:bg-white/65 hover:border-wedding-pink-medium rounded-2xl p-4 transition-all duration-300 shadow-sm relative">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-wedding-magenta bg-white/55 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-white/40">
                        <Clock className="w-3.5 h-3.5" />
                        {item.time} hrs
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-600 bg-white/40 backdrop-blur-xs px-2 py-0.5 rounded-sm border border-white/30">
                        👗 {item.dressCode}
                      </span>
                    </div>
                    <h3 className="font-serif text-md sm:text-lg font-bold text-wedding-burgundy">
                      {item.title}
                    </h3>
                    <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed mt-1 font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Venue Map, Info, and Dress Guidelines */}
        <div className="md:col-span-5 space-y-6">
          {/* Map details box */}
          <div className="backdrop-blur-md bg-white/45 border border-white/60 rounded-2xl p-4 shadow-sm" id="itinerary-map-box">
            <div className="flex items-center gap-2 text-wedding-burgundy font-serif font-bold text-sm mb-3">
              <MapPin className="w-4 h-4 text-wedding-magenta" />
              Venue: Aadya Farms and Leisure
            </div>
            
            {/* Google map iframe wrapper */}
            <div className="rounded-xl overflow-hidden border border-white/60 aspect-video mb-3 relative group">
              <iframe
                title="Aadya Farms and Leisure Bengaluru Google Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.127495914619!2d77.58554287517622!3d13.154101887178051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m1s0x3bae190bf85bfdf3%3A0xe7f98e61e06fa53f!2sAadya%20Farms%20and%20Leisure!5e0!3m2!1sen!2sin!4v1718712345678!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
              ></iframe>
            </div>

            <p className="text-zinc-600 text-xs text-center leading-relaxed font-sans font-medium mb-3">
              Yelahanka, Bengaluru, Karnataka 560064, India
            </p>
            <a
              href="https://maps.app.goo.gl/9LSmvSnyGqX9WcKMA"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-white/65 to-wedding-pink-light/65 hover:bg-white text-wedding-burgundy text-xs font-semibold rounded-xl border border-white/80 tracking-wide uppercase transition-all shadow-xs"
            >
              Get Directions on Map <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Sweet note about clothing and colors */}
          <div className="backdrop-blur-md bg-white/35 border border-white/80 rounded-2xl p-4 space-y-3 shadow-sm">
            <h4 className="font-serif text-sm font-bold text-wedding-burgundy flex items-center gap-2">
              ✨ Dress Code & Style Guidelines
            </h4>
            
            {/* Visual indicators for Tux & dress */}
            <div className="flex items-center justify-around py-2 border-y border-white/40">
              <div className="text-center">
                <span className="text-2xl">🤵‍♂️</span>
                <p className="text-[10px] font-sans font-medium text-zinc-600 mt-1">Formal / Sherwani</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">💃</span>
                <p className="text-[10px] font-sans font-medium text-zinc-600 mt-1">Lehenga / Gown</p>
              </div>
            </div>

            <div className="text-[11px] leading-relaxed text-zinc-700 space-y-2 font-medium">
              <p>
                <strong>Day 1 (Nov 20):</strong> Think block colors, mirrors, block prints, flowy materials. Put on your most comfortable dancing footwear!
              </p>
              <p>
                <strong>Day 2 (Nov 21):</strong> Classy pastels, traditional temple borders or formal evening wear. 
              </p>
              <div className="p-2.5 bg-white/45 border border-white/60 rounded-xl mt-2 text-wedding-burgundy font-medium text-center italic">
                🌸 "We kindly request out of custom respect to avoid pure white shades, allowing the wedding couple to shine."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
