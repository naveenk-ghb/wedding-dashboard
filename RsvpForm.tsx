import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, Users, Calendar, Sparkles, Sliders, ChevronRight, Check, Key, HelpCircle, Download, Trash2, Heart } from "lucide-react";
import { RsvpSubmission } from "../types";

interface RsvpFormProps {
  onNewSubmission: (submission: RsvpSubmission) => void;
}

export default function RsvpForm({ onNewSubmission }: RsvpFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null);
  const [guestsCount, setGuestsCount] = useState(1);
  const [eventsSelected, setEventsSelected] = useState<string[]>(["engagement", "sangeet", "wedding", "reception"]);
  const [dietaryPreference, setDietaryPreference] = useState("veg");
  const [shuttleRequest, setShuttleRequest] = useState(false);
  const [shuttleDetails, setShuttleDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [blessing, setBlessing] = useState("");

  // Error and submission controls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Admin / Host view states
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [allSubmissions, setAllSubmissions] = useState<RsvpSubmission[]>([]);
  const [adminError, setAdminError] = useState("");

  const eventOptions = [
    { id: "sangeet", label: "Sangeet & Engagement Dance (Nov 20)" },
    { id: "wedding", label: "Amuhurtham & Wedding Vows (Nov 21 Morning)" },
    { id: "reception", label: "Grand Reception & Party Dinner (Nov 21 Evening)" }
  ];

  // Load existing submissions on load for Admin View
  useEffect(() => {
    const loaded = getStoredRsvps();
    setAllSubmissions(loaded);
  }, []);

  const getStoredRsvps = (): RsvpSubmission[] => {
    const raw = localStorage.getItem("aishu_dev_rsvps");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return [];
      }
    }
    // Pre-seed some loving dummy RSVPs so the Admin Dashboard and Wishes Wall don't look blank on load!
    const seed: RsvpSubmission[] = [
      {
        id: "seed-1",
        name: "Shyam & Rohini",
        email: "shyam@gmail.com",
        attendance: "yes",
        eventsSelected: ["sangeet", "wedding", "reception"],
        guestsCount: 2,
        dietaryPreference: "veg",
        shuttleRequest: true,
        shuttleDetails: "BA119 arriving Nov 19 @ 10:30 AM",
        notes: "So, so excited to fly down from London to witness this gorgeous union!",
        submittedAt: new Date(2026, 5, 10).toISOString()
      },
      {
        id: "seed-2",
        name: "Pooja Malhotra",
        email: "poojamal@yahoo.com",
        attendance: "yes",
        eventsSelected: ["sangeet", "reception"],
        guestsCount: 1,
        dietaryPreference: "jain",
        shuttleRequest: false,
        notes: "Team Bride is ready to set the dance floor on fire! Sangeet rehearsal is on!",
        submittedAt: new Date(2026, 5, 14).toISOString()
      }
    ];
    localStorage.setItem("aishu_dev_rsvps", JSON.stringify(seed));
    return seed;
  };

  const handleCheckboxChange = (eventId: string) => {
    if (eventsSelected.includes(eventId)) {
      setEventsSelected(eventsSelected.filter(id => id !== eventId));
    } else {
      setEventsSelected([...eventsSelected, eventId]);
    }
  };

  const validateStep1 = () => {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim() || !email.includes("@")) return "Please enter a valid email address.";
    if (attendance === null) return "Please choose your RSVP attendance.";
    return null;
  };

  const handleNextStep = () => {
    const errorMsg = validateStep1();
    if (errorMsg) {
      setSubmitError(errorMsg);
      return;
    }
    setSubmitError("");
    if (attendance === "no") {
      // Direct jump to final submission notes
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const triggerRsvpSubmit = () => {
    setIsSubmitting(true);
    setSubmitError("");

    setTimeout(() => {
      try {
        const payload: RsvpSubmission = {
          id: `rsvp-${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          attendance: attendance!,
          eventsSelected: attendance === "yes" ? eventsSelected : [],
          guestsCount: attendance === "yes" ? guestsCount : 0,
          dietaryPreference: attendance === "yes" ? dietaryPreference : "none",
          shuttleRequest: attendance === "yes" ? shuttleRequest : false,
          shuttleDetails: attendance === "yes" && shuttleRequest ? shuttleDetails : "",
          notes: notes.trim() || undefined,
          submittedAt: new Date().toISOString()
        };

        // Save to LocalStorage list
        const list = getStoredRsvps();
        const updatedList = [payload, ...list];
        localStorage.setItem("aishu_dev_rsvps", JSON.stringify(updatedList));

        // Let parent know about new wish
        if (blessing.trim()) {
          onNewSubmission(payload);
          // Store blessing custom wish in local storage too!
          const rawWishes = localStorage.getItem("aishu_dev_wishes") || "[]";
          const wishes = JSON.parse(rawWishes);
          const newWish = {
            id: `wish-${Date.now()}`,
            name: name.trim(),
            relationship: "Loved Guest",
            message: blessing.trim(),
            createdAt: new Date().toISOString(),
            likesCount: 0
          };
          localStorage.setItem("aishu_dev_wishes", JSON.stringify([newWish, ...wishes]));
          window.dispatchEvent(new Event("storage_custom_wishes_update"));
        }

        // Reset
        setIsSuccess(true);
        setAllSubmissions(updatedList);
      } catch (err) {
        setSubmitError("Failed to save RSVP. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }, 900);
  };

  // Host dashboard controls
  const handleVerifyHost = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    
    // Simply accept classic elegant pass: "AISHUDEV2026" or "aishudev"
    const parsed = adminPassword.trim().toUpperCase();
    if (parsed === "AISHUDEV" || parsed === "AISHUDEV2026" || parsed === "DEV") {
      setIsAdminMode(true);
      setAdminPassword("");
    } else {
      setAdminError("Invalid passcode structure. Use 'AISHUDEV2026' to verify.");
    }
  };

  const triggerDeleteRsvp = (id: string) => {
    if (window.confirm("Are you sure you want to remove this Guest RSVP?")) {
      const refreshed = allSubmissions.filter((item) => item.id !== id);
      setAllSubmissions(refreshed);
      localStorage.setItem("aishu_dev_rsvps", JSON.stringify(refreshed));
    }
  };

  const triggerExportCsv = () => {
    const headers = "Guest Name,Email,Attendance,Guests Count,Events Selected,Dietary Pref,Shuttle Requested,Shuttle Flight,Notes,Submitted At\n";
    const csvContent = allSubmissions.map((r) => {
      const escapedNotes = (r.notes || "").replace(/"/g, '""');
      const escapedDetails = (r.shuttleDetails || "").replace(/"/g, '""');
      return `"${r.name}","${r.email}","${r.attendance}",${r.guestsCount},"${r.eventsSelected.join(", ")}","${r.dietaryPreference}",${r.shuttleRequest},"${escapedDetails}","${escapedNotes}","${r.submittedAt}"`;
    }).join("\n");

    const blob = new Blob([headers + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Aishu_Dev_Wedding_RSVPs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-10 px-4 max-w-lg mx-auto" id="rsvp-section-anchor">
      <div className="glass-panel-lg rounded-[40px] p-6 sm:p-8 shadow-2xl shadow-rose-200/40 relative overflow-hidden">
        {/* Soft elegant watercolor rose vector bg */}
        <div className="absolute right-0 top-0 w-32 h-32 opacity-5 text-wedding-pink-medium pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,0 C60,20 80,40 100,50 C80,60 60,80 50,100 C40,80 20,60 0,50 C20,40 40,20 50,0 Z" />
          </svg>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="w-16 h-16 backdrop-blur-md bg-white/55 border border-white rounded-full flex items-center justify-center mx-auto text-wedding-magenta mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="font-script text-3xl text-wedding-magenta block">
              Dhanyawaad / Thank You!
            </span>
            <h3 className="font-serif text-xl font-bold text-wedding-burgundy">
              Your RSVP Has Been Logged
            </h3>
            <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-medium">
              We have securely recorded your preferences! Aishu & Dev are overjoyed to count down the weeks to celebrate this union with you.
            </p>
            {blessing && (
              <div className="p-3 backdrop-blur-sm bg-white/60 border border-white rounded-2xl text-xs text-wedding-burgundy italic max-w-xs mx-auto font-medium shadow-xs">
                "Your beautiful words were added to our Blessings Wall!"
              </div>
            )}
            <button
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
                setName("");
                setEmail("");
                setAttendance(null);
                setBlessing("");
                setNotes("");
              }}
              className="mt-4 px-5 py-2.5 bg-wedding-burgundy hover:bg-wedding-magenta text-[#fdf2f0] text-xs font-semibold uppercase tracking-wider rounded-full transition-all active:scale-95 duration-150 shadow-sm cursor-pointer"
            >
              Update RSVP / New Submission
            </button>
          </motion.div>
        ) : !isAdminMode ? (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <span className="font-script text-3xl text-wedding-magenta block">
                Join our Joy
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-wedding-burgundy tracking-wide uppercase">
                Submit Your RSVP
              </h2>
              <p className="text-zinc-600 font-medium text-xs mt-1">
                Please complete your attendance responses before October 25, 2026.
              </p>
            </div>

            {/* Step indicators */}
            <div className="flex gap-2 justify-center mb-6 text-zinc-500 font-mono text-[9px]">
              <span className={`px-2 py-0.5 rounded-full ${step === 1 ? "bg-wedding-magenta text-[#fdf2f0] font-bold" : "bg-white/40 border border-white/60"}`}>
                1. BASIC INFO
              </span>
              <span className="self-center">➔</span>
              <span className={`px-2 py-0.5 rounded-full ${step === 2 ? "bg-wedding-magenta text-[#fdf2f0] font-bold" : "bg-white/40 border border-white/60"}`}>
                2. EVENT PLAN
              </span>
              <span className="self-center">➔</span>
              <span className={`px-2 py-0.5 rounded-full ${step === 3 ? "bg-wedding-magenta text-[#fdf2f0] font-bold" : "bg-white/40 border border-white/60"}`}>
                3. BLESSINGS
              </span>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[10px] text-wedding-burgundy font-bold uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Shyam Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/65 backdrop-blur-xs border border-white/80 focus:border-wedding-magenta focus:bg-white w-full rounded-xl px-4 py-2 text-xs text-zinc-850 font-medium select-none focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-wedding-burgundy font-bold uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. shyam@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/65 backdrop-blur-xs border border-white/80 focus:border-wedding-magenta focus:bg-white w-full rounded-xl px-4 py-2 text-xs text-zinc-850 font-medium select-none focus:outline-none transition-all"
                    />
                  </div>

                  {/* Yes/No Button Boxes */}
                  <div>
                    <label className="block text-[10px] text-wedding-burgundy font-bold uppercase tracking-wider mb-2 text-center">Are you attending with us?</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAttendance("yes")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                          attendance === "yes"
                            ? "bg-white/85 border-wedding-magenta text-wedding-magenta shadow-sm scale-102"
                            : "bg-white/35 backdrop-blur-xs border-white/60 text-zinc-600 hover:bg-white/50 hover:text-wedding-burgundy"
                        }`}
                      >
                        <span className="text-xl">🌸</span>
                        <span className="text-xs font-semibold mt-1">Attending with Joy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendance("no")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                          attendance === "no"
                            ? "bg-white/85 border-zinc-500 text-zinc-800 shadow-sm scale-102"
                            : "bg-white/35 backdrop-blur-xs border-white/60 text-zinc-600 hover:bg-white/50 hover:text-zinc-800"
                        }`}
                      >
                        <span className="text-xl">✉️</span>
                        <span className="text-xs font-semibold mt-1">Regretfully Decline</span>
                      </button>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-50/65 border border-red-300 rounded-xl text-red-700 text-xs flex gap-1.5 items-center">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex justify-center items-center gap-1.5 w-full py-3 bg-wedding-burgundy hover:bg-wedding-magenta text-[#fdf2f0] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer active:scale-95 duration-150 shadow-sm"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center bg-white/30 backdrop-blur-xs p-2.5 rounded-xl border border-white/60">
                    <span className="text-[10px] text-zinc-700 font-semibold">Guests RSVP Count (Including you)</span>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                      className="bg-white/85 border select:outline-none focus:outline-none border-white/80 rounded-lg py-1 px-3 text-xs font-bold text-wedding-burgundy"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={5}>5 Guests (Max)</option>
                    </select>
                  </div>

                  {/* Multi-Select Events */}
                  <div>
                    <label className="block text-[10px] text-wedding-burgundy font-bold uppercase tracking-wider mb-2">Select Attending Events</label>
                    <div className="space-y-2">
                      {eventOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => handleCheckboxChange(opt.id)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer hover:bg-white/50 transition-colors ${
                            eventsSelected.includes(opt.id)
                              ? "bg-white/80 border-wedding-pink-medium text-wedding-burgundy"
                              : "bg-white/30 border-white/60 text-zinc-500"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            eventsSelected.includes(opt.id) ? "bg-wedding-magenta border-wedding-magenta text-white" : "border-white/80 bg-white/30"
                          }`}>
                            {eventsSelected.includes(opt.id) && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs select-none font-semibold leading-none">{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dietary preference selecting */}
                  <div>
                    <label className="block text-[10px] text-wedding-burgundy font-bold uppercase tracking-wider mb-1.5">Dietary Preferences</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "veg", label: "🥦 Pure Vegetarian" },
                        { id: "non-veg", label: "🍗 Non-Vegetarian" },
                        { id: "jain", label: "🧘 Jain Pure Diet" },
                        { id: "vegan", label: "🌱 Organic Vegan" }
                      ].map((diet) => (
                        <button
                          key={diet.id}
                          type="button"
                          onClick={() => setDietaryPreference(diet.id)}
                          className={`py-2 px-3 border text-left text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                            dietaryPreference === diet.id
                              ? "bg-white/85 border-wedding-pink-medium text-wedding-burgundy shadow-xs"
                              : "bg-white/35 border-white/60 text-zinc-650 hover:bg-white/50"
                          }`}
                        >
                          {diet.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transports checkbox toggle */}
                  <div className="p-3 bg-white/30 backdrop-blur-xs border border-white/50 rounded-2xl space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shuttleRequest}
                        onChange={(e) => setShuttleRequest(e.target.checked)}
                        className="w-4 h-4 accent-wedding-magenta"
                      />
                      <span className="text-[11px] font-bold text-wedding-burgundy select-none leading-none">Need Airport pick-up shuttle?</span>
                    </label>

                    {shuttleRequest && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-1.5"
                      >
                        <input
                          type="text"
                          placeholder="e.g. Flight BA119, Arriving Nov 19 @ 10:30 AM"
                          value={shuttleDetails}
                          onChange={(e) => setShuttleDetails(e.target.value)}
                          className="bg-white/60 backdrop-blur-sm border border-white/80 focus:border-wedding-magenta focus:bg-white w-full rounded-xl px-3 py-1.5 text-xs text-zinc-850 font-medium select-none focus:outline-none"
                        />
                        <span className="text-[9px] text-zinc-500 mt-1 block font-semibold">Help coordinators structure shuttle timings correctly</span>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 bg-white/35 hover:bg-white border border-white/60 text-zinc-700 text-xs font-semibold uppercase rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 flex justify-center items-center gap-1.5 py-3 bg-wedding-burgundy hover:bg-wedding-magenta text-[#fdf2f0] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                      Blessings & Notes <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[10px] text-wedding-burgundy font-bold uppercase tracking-wider mb-1">
                      {attendance === "no" ? "Send a Message of Love" : "Wedding blessing & wishes"}
                    </label>
                    <textarea
                      placeholder="e.g. Wishing you gorgeous lifetimes of health, joy, and travel adventures! Sangeet can't come fast enough..."
                      rows={3}
                      value={blessing}
                      onChange={(e) => setBlessing(e.target.value)}
                      className="bg-white/65 backdrop-blur-xs border border-white/80 focus:border-wedding-magenta focus:bg-white w-full rounded-xl px-3 py-2 text-xs text-zinc-850 font-medium select-none focus:outline-none resize-none"
                    ></textarea>
                    <span className="text-[9px] text-zinc-500 font-semibold mt-1 block font-sans">
                      Leaving a blessing will put your note live on our Blessings Wall!
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-wedding-burgundy font-bold uppercase tracking-wider mb-1">Any specific dietary allergies or note?</label>
                    <input
                      type="text"
                      placeholder="e.g. Vegan allergies / No garlic Jain option"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-white/65 backdrop-blur-xs border border-white/80 focus:border-wedding-magenta focus:bg-white w-full rounded-xl px-3 py-2 text-xs text-zinc-850 font-medium select-none focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(attendance === "no" ? 1 : 2)}
                      className="px-4 py-3 bg-white/35 hover:bg-white border border-white/60 text-zinc-700 text-xs font-semibold uppercase rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={triggerRsvpSubmit}
                      disabled={isSubmitting}
                      className="flex-1 flex justify-center items-center gap-1.5 py-3 bg-wedding-magenta hover:bg-wedding-burgundy text-[#fdf2f0] font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 active:scale-95 duration-150"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-1">
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Registering...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          Complete RSVP <Heart className="w-3.5 h-3.5 fill-current" />
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hidden link block to bypass to Admin verification */}
            <div className="mt-8 pt-4 border-t border-white/40 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
              <form onSubmit={handleVerifyHost} className="flex gap-1.5 items-center max-w-sm mx-auto">
                <Key className="w-3 h-3 text-zinc-550" />
                <input
                  type="password"
                  placeholder="Hosts login space..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-transparent text-[9px] w-24 text-center text-zinc-700 font-semibold focus:text-wedding-burgundy border-b select:outline-none border-white/60 focus:border-wedding-magenta py-0.5 placeholder-zinc-500 uppercase"
                />
                <button type="submit" className="text-[9px] font-bold text-wedding-magenta uppercase font-sans hover:underline cursor-pointer">
                  Go
                </button>
              </form>
            </div>
            {adminError && <p className="text-[9px] text-center text-red-500 mt-1 font-semibold">{adminError}</p>}
          </div>
        ) : (
          /* Host Dashboard Panel */
          <div className="space-y-4" id="hosts-admin-dashboard-panel">
            <div className="flex justify-between items-center pb-3 border-b border-white/60">
              <div>
                <span className="text-[10px] font-extrabold font-mono tracking-wider text-wedding-magenta uppercase">
                  HOST ACCESS APPROVED
                </span>
                <h3 className="font-serif text-lg font-bold text-wedding-burgundy">
                  Aishu & Dev Organizer Dashboard
                </h3>
              </div>
              <button
                onClick={() => setIsAdminMode(false)}
                className="text-xs text-zinc-700 bg-white/40 hover:bg-white border border-white/80 px-2.5 py-1 rounded-lg font-semibold cursor-pointer"
              >
                Log Out
              </button>
            </div>

            {/* Attendance stats */}
            <div className="grid grid-cols-4 gap-2 text-center py-2.5 bg-white/40 backdrop-blur-md border border-white/80 rounded-2xl">
              <div>
                <span className="text-sm font-extrabold text-wedding-burgundy">
                  {allSubmissions.length}
                </span>
                <span className="text-[9px] text-zinc-600 font-semibold block">Total RSVPs</span>
              </div>
              <div>
                <span className="text-sm font-extrabold text-emerald-700">
                  {allSubmissions.filter((s) => s.attendance === "yes").length}
                </span>
                <span className="text-[9px] text-zinc-600 font-semibold block">Attending</span>
              </div>
              <div>
                <span className="text-sm font-extrabold text-wedding-magenta">
                  {allSubmissions.reduce((sum, s) => sum + (s.attendance === "yes" ? s.guestsCount : 0), 0)}
                </span>
                <span className="text-[9px] text-zinc-600 font-semibold block">Headcount</span>
              </div>
              <div>
                <span className="text-sm font-extrabold text-amber-600">
                  {allSubmissions.filter((s) => s.shuttleRequest).length}
                </span>
                <span className="text-[9px] text-zinc-600 font-semibold block">Shuttles req</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-semibold font-sans uppercase">
                List of registered responses
              </span>
              <button
                onClick={triggerExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-[#fdf2f0] text-[10px] font-bold rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Download className="w-3 h-3" /> Export to CSV
              </button>
            </div>

            {/* Table scroll */}
            <div className="max-h-60 overflow-y-auto border border-white/60 rounded-xl bg-white/45 backdrop-blur-md p-2 divide-y divide-white/50">
              {allSubmissions.length === 0 ? (
                <p className="text-center text-zinc-500 text-xs py-4 font-semibold">No RSVPs registered yet.</p>
              ) : (
                allSubmissions.map((sub) => (
                  <div key={sub.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-800">{sub.name}</span>
                        {sub.attendance === "yes" ? (
                          <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                            +{sub.guestsCount}
                          </span>
                        ) : (
                          <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1.5 py-0.2 rounded">
                            Declined
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono italic block truncate">{sub.email}</span>
                      {sub.attendance === "yes" && (
                        <div className="flex gap-1.5 flex-wrap pt-1 font-sans text-[10px]">
                          <span className="bg-white/60 border border-white px-1.5 py-0.2 rounded uppercase text-zinc-600 font-semibold">{sub.dietaryPreference} diet</span>
                          {sub.shuttleRequest && (
                            <span className="bg-amber-100 border border-amber-200 text-amber-805 font-bold px-1 rounded truncate">
                              🚌 Shuttle: {sub.shuttleDetails || "Req"}
                            </span>
                          )}
                        </div>
                      )}
                      {sub.notes && <p className="text-[10px] text-zinc-650 font-medium italic pt-1 border-t border-white/40 mt-1">"{sub.notes}"</p>}
                    </div>

                    <button
                      onClick={() => triggerDeleteRsvp(sub.id)}
                      className="p-1 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <p className="text-[9px] text-center text-zinc-500 font-semibold">
              Passcode tip for coordinators: <strong>AISHUDEV2026</strong>. Submissions are saved persistently in local storage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
