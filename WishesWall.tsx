import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageSquarePlus, MessageSquare, Sparkles } from "lucide-react";
import { GuestWish } from "../types";

export default function WishesWall() {
  const [wishes, setWishes] = useState<GuestWish[]>([]);

  const loadWishes = () => {
    const raw = localStorage.getItem("aishu_dev_wishes");
    if (raw) {
      try {
        setWishes(JSON.parse(raw));
        return;
      } catch (e) {
        // ignore
      }
    }

    // Default Seed Wishes representing different families & friends
    const seed: GuestWish[] = [
      {
        id: "seed-wish-1",
        name: "Uncle Naveen & Family",
        relationship: "Family",
        message: "Dev and Aishwarya, watching your two distinct worlds blend into one beautiful journey is an absolute dream. We are blocking our flights from London Heathrow right now! Sangeet rehearsals are already underway in our living room!",
        createdAt: new Date(2026, 5, 12).toISOString(),
        likesCount: 18,
        tags: ["UK Family", "Team Sangeet"]
      },
      {
        id: "seed-wish-2",
        name: "Meera & Sanjith K.",
        relationship: "Best Friends",
        message: "Wishing Aishu and Dev a lifetime of delicious filter coffee, gorgeous travels across Europe, and endless laughter. Bengaluru is ready to welcome everyone with jasmine garlands! Team Bride is winning the Sangeet dance duel, easily!",
        createdAt: new Date(2026, 5, 15).toISOString(),
        likesCount: 24,
        tags: ["Besties", "Team Bride"]
      },
      {
        id: "seed-wish-3",
        name: "Grandma Savithri",
        relationship: "Grandmother",
        message: "Two beautiful cultures, united by true love. My blessings are always with you both. I cannot wait to witness the sacred Phere ceremony under the Bengaluru morning sun on November 21st.",
        createdAt: new Date(2026, 5, 16).toISOString(),
        likesCount: 31,
        tags: ["Blessings", "Grandmother"]
      }
    ];

    localStorage.setItem("aishu_dev_wishes", JSON.stringify(seed));
    setWishes(seed);
  };

  useEffect(() => {
    loadWishes();

    // Listen to custom local storage event triggered by RSVP submits
    const handleWishesUpdate = () => {
      loadWishes();
    };

    window.addEventListener("storage_custom_wishes_update", handleWishesUpdate);
    return () => {
      window.removeEventListener("storage_custom_wishes_update", handleWishesUpdate);
    };
  }, []);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const updated = wishes.map((item) => {
      if (item.id === id) {
        return { ...item, likesCount: item.likesCount + 1 };
      }
      return item;
    });
    setWishes(updated);
    localStorage.setItem("aishu_dev_wishes", JSON.stringify(updated));
  };

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto" id="wishes-guestbook-section">
      <div className="text-center mb-8">
        <span className="font-script text-3xl text-wedding-magenta block mb-1">
          Blessings & Love
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-wedding-burgundy tracking-wide uppercase">
          Wishes Wall & Guestbook
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-medium to-transparent mx-auto mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start">
        <AnimatePresence mode="popLayout">
          {wishes.map((item, index) => {
            // Pick a subtle romantic rotation degrees, to look like realistic pinning with love!
            const rotationDeg = (index % 3 === 0) ? "-rotate-1" : (index % 3 === 1) ? "rotate-1" : "rotate-0";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`glass-panel-sm p-5 rounded-[24px] hover:shadow-lg hover:shadow-rose-100/30 transition-shadow relative border border-white/50 border-t-4 border-t-wedding-magenta/75 ${rotationDeg}`}
                id={`wish-note-${index}`}
              >
                {/* Visual pin dots */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {item.tags?.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="text-[8px] tracking-wide font-mono uppercase bg-white/40 border border-white/55 text-wedding-magenta font-semibold px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  {/* Message body with beautiful quotes styling */}
                  <p className="text-zinc-700 text-xs leading-relaxed italic pr-2 font-medium">
                    "{item.message}"
                  </p>

                  <div className="text-center md:flex items-center justify-between border-t border-white/40 pt-3">
                    <div className="truncate pr-1 text-left">
                      <span className="block font-serif font-extrabold text-xs text-wedding-burgundy leading-none truncate">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-semibold tracking-wide">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      aria-label="Like blessing"
                      className="flex items-center gap-1.5 py-1 px-2.5 bg-white/45 border border-white/80 hover:bg-white text-wedding-magenta rounded-full text-[10px] font-bold tracking-tight active:scale-90 transition-all cursor-pointer mt-2 md:mt-0 shadow-xs"
                    >
                      <Heart className="w-3 h-3 fill-wedding-magenta text-wedding-magenta shrink-0 animate-pulse" />
                      <span>{item.likesCount}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Dynamic Join Card Callout - Put Blessing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="backdrop-blur-md bg-white/20 border-2 border-dashed border-white/60 p-6 rounded-[24px] text-center flex flex-col justify-center items-center gap-3 min-h-[180px] self-stretch shadow-xs"
        >
          <div className="w-10 h-10 bg-white/55 hover:bg-white rounded-full border border-white/80 flex items-center justify-center text-wedding-magenta">
            <MessageSquarePlus className="w-5 h-5 animate-bounce" />
          </div>
          <span className="font-serif font-bold text-wedding-burgundy text-sm">
            Leave Your Blessing Too!
          </span>
          <p className="text-zinc-700 font-semibold text-[11px] leading-relaxed max-w-[200px]">
            Scroll to our interactive RSVP below to secure your attendance and display your loving wish!
          </p>
          <button
            onClick={() => {
              const el = document.getElementById("rsvp-section-anchor");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-[10px] font-bold text-wedding-magenta hover:text-wedding-burgundy uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all hover:translate-x-1"
          >
            Go to RSVP form ➔
          </button>
        </motion.div>
      </div>
    </div>
  );
}
