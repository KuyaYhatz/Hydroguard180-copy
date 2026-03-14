import { motion, useInView } from 'motion/react';
import { Link } from 'react-router';
import { useRef, useState } from 'react';
import {
  AlertTriangle,
  Users,
  Package,
  Heart,
  Phone,
  Home,
  CheckCircle2,
  MapPin,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Droplets,
  Zap,
  ArrowRight,
  Clock,
  BookOpen,
  Siren,
  CircleAlert,
  HandHeart,
  Backpack,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const floodImage = 'https://images.unsplash.com/photo-1661207718008-4f57cb333fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vZCUyMGVtZXJnZW5jeSUyMHJlc2N1ZSUyMFBoaWxpcHBpbmVzfGVufDF8fHx8MTc3MjQyMDc3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
const firstAidImage = 'https://images.unsplash.com/photo-1765996796562-ce301df337a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBmaXJzdCUyMGFpZCUyMGtpdCUyMHN1cHBsaWVzfGVufDF8fHx8MTc3MjQyMDc3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
const volunteerImage = 'https://images.unsplash.com/photo-1752805768387-1a7a6ca751b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwZmxvb2QlMjByZXNjdWUlMjB0cmFpbmluZyUyMGVtZXJnZW5jeSUyMHJlc3BvbmRlcnN8ZW58MXx8fHwxNzcyNDIzNjU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

// Accordion component for go-bag categories
function GoBagCategory({ title, icon: Icon, items, color, delay }: {
  title: string;
  icon: React.ElementType;
  items: string[];
  color: string;
  delay: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all text-left"
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#1F2937]">{title}</h4>
          <p className="text-xs text-gray-400">{items.length} items</p>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-4 pt-2 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Training() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const evacuationSteps = [
    { step: 'Listen for announcements', detail: 'Barangay officials will use megaphones, SMS alerts, and the Hydro Guard system to notify you.', icon: Siren },
    { step: 'Stay calm, gather everyone', detail: 'Account for every household member — especially children, elderly, and persons with disability.', icon: Users },
    { step: 'Grab your go-bag', detail: 'Your pre-packed emergency bag with documents, meds, water, and essentials.', icon: Backpack },
    { step: 'Shut off utilities', detail: 'Turn off electricity at the main breaker, gas valves, and water mains if you have time.', icon: Zap },
    { step: 'Lock up and leave', detail: 'Secure your home, then follow the designated evacuation route — don\'t take shortcuts.', icon: Home },
    { step: 'Head to the evacuation center', detail: 'Go to the Barangay 180 Multi-Purpose Hall or the nearest designated safe zone.', icon: MapPin },
    { step: 'Check in on arrival', detail: 'Register with barangay officials so they know you\'re safe and accounted for.', icon: ShieldCheck },
  ];

  const goBagCategories = [
    {
      title: 'Food & Water',
      icon: Droplets,
      color: '#3B82F6',
      items: ['Bottled water (3-day supply, 1 gallon/person/day)', 'Non-perishable food (canned goods, crackers, energy bars)', 'Manual can opener'],
    },
    {
      title: 'Medical & Hygiene',
      icon: Heart,
      color: '#EF4444',
      items: ['First aid kit and prescription medications', 'Face masks and hand sanitizer', 'Toiletries and hygiene items', 'Insect repellent'],
    },
    {
      title: 'Tools & Communication',
      icon: Phone,
      color: '#8B5CF6',
      items: ['Flashlight and extra batteries', 'Battery-powered or hand-crank radio', 'Phone charger and power bank', 'Whistle for signaling help'],
    },
    {
      title: 'Documents & Valuables',
      icon: BookOpen,
      color: '#FF6A00',
      items: ['IDs, birth certificates, insurance papers (in waterproof bag)', 'Cash in small denominations', 'Recent family photo (for identification)'],
    },
    {
      title: 'Clothing & Comfort',
      icon: Package,
      color: '#22C55E',
      items: ['Change of clothes per family member', 'Rain jacket or poncho', 'Blanket or sleeping bag', 'Sturdy closed-toe shoes'],
    },
  ];

  const firstAidBasics = [
    {
      title: 'Wounds & Cuts',
      emoji: '🩹',
      steps: [
        'Clean the wound with clean water',
        'Apply pressure with clean cloth to stop bleeding',
        'Apply antiseptic if available',
        'Cover with sterile bandage, change daily',
      ],
    },
    {
      title: 'Hypothermia',
      emoji: '🥶',
      steps: [
        'Move person to a warm, dry location',
        'Remove wet clothing gently',
        'Wrap in dry blankets — layer them',
        'Give warm (not hot) beverages if conscious',
      ],
    },
    {
      title: 'Near-Drowning',
      emoji: '🚨',
      steps: [
        'Call 911 immediately — do NOT delay',
        'Check for breathing and pulse',
        'Begin CPR if trained and necessary',
        'Keep person warm and on their side',
      ],
    },
  ];

  const safetyDos = [
    'Follow official information sources only',
    'Help elderly and vulnerable neighbors evacuate',
    'Keep emergency contacts saved on your phone',
    'Charge devices when warnings are issued',
    'Report emergencies to 911 immediately',
  ];

  const safetyDonts = [
    'Never walk or drive through floodwater',
    'Stay away from downed power lines',
    'Don\'t return home until authorities say it\'s safe',
    'Avoid contact with contaminated floodwater',
    'Don\'t ignore early warning alerts',
  ];

  return (
    <div className="relative overflow-x-hidden bg-gray-50">
      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-[70vh] lg:min-h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={floodImage}
            alt="Flood emergency response"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#26343A] via-[#26343A]/70 to-[#26343A]/30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />

        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/3 right-1/5 w-[350px] h-[350px] bg-[#FF6A00]/12 rounded-full blur-[140px]"
            animate={{ opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div
          className="relative w-full z-10 pb-32 lg:pb-36"
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF6A00]/20 backdrop-blur-md border border-[#FF6A00]/30 rounded-full">
                  <AlertTriangle size={14} className="text-[#FF6A00]" />
                  <span className="text-sm text-white/90">Emergency Preparedness</span>
                </div>
              </motion.div>

              <div className="overflow-hidden mb-3">
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05]"
                  initial={{ y: 80, opacity: 0 }}
                  animate={heroInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  Know what to do
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-8">
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
                  initial={{ y: 80, opacity: 0 }}
                  animate={heroInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="text-[#FF6A00]">before the flood.</span>
                </motion.h1>
              </div>

              <motion.p
                className="text-lg text-gray-300 leading-relaxed max-w-lg mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                Preparedness isn't about fear — it's about giving your family the best chance. Here's everything you need, all in one place.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <a
                  href="#evacuation"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-[#FF6A00] text-white rounded-xl font-medium hover:bg-[#E55F00] transition-all shadow-lg shadow-orange-500/25"
                >
                  Start Learning
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href="#go-bag"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.08] border border-white/15 text-white rounded-xl font-medium hover:bg-white/[0.14] transition-all backdrop-blur-sm"
                >
                  <Package size={16} />
                  Go-Bag Checklist
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── QUICK STATS BAR ─── */}
      <section className="relative z-20 -mt-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-around gap-6"
          >
            {[
              { label: 'Avg. Flood Warning Lead Time', value: '30 min', icon: Clock, color: '#3B82F6' },
              { label: 'Evacuation Routes', value: '3 active', icon: ArrowRight, color: '#FF6A00' },
              { label: 'Trained Volunteers', value: '40+', icon: HandHeart, color: '#22C55E' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2 }}
                className="flex items-center gap-3 text-center sm:text-left"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1F2937]">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── EVACUATION PROCEDURES ─── */}
      <section id="evacuation" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Intro */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:sticky lg:top-32"
              >
                <p className="text-sm tracking-widest text-[#FF6A00] font-medium uppercase mb-3">When Alert Level 4 hits</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-5">
                  Evacuation<br />Procedures
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  When the system triggers a <span className="text-red-500 font-semibold">Critical Alert</span>, every minute matters. These steps have been practiced with barangay officials and MDRRMO — follow them in order.
                </p>
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CircleAlert size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-red-800 font-medium">Don't wait for the water to rise.</p>
                      <p className="text-xs text-red-600 mt-1">If you receive an alert, begin evacuating immediately. Most flood injuries happen because people underestimate how fast water moves.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Steps */}
            <div className="lg:col-span-7">
              <div className="space-y-4">
                {evacuationSteps.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="group flex gap-5 p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#FF6A00]/20 hover:shadow-md transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6A00] to-[#FF8C3A] text-white flex items-center justify-center font-bold shadow-sm shadow-orange-200 group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="pt-0.5">
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon size={15} className="text-gray-400" />
                        <h4 className="font-semibold text-[#1F2937]">{item.step}</h4>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EMERGENCY GO-BAG ─── */}
      <section id="go-bag" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Photo + context */}
            <motion.div
              className="lg:col-span-5 order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/8 to-[#FF6A00]/8 rounded-[28px] blur-[30px]" />
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <ImageWithFallback
                    src={firstAidImage}
                    alt="Emergency supplies"
                    className="w-full h-72 lg:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#26343A]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4">
                      <p className="text-white text-sm font-medium mb-1">Pro tip from our responders:</p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Keep your go-bag near the door, not in a closet. During a real evacuation, you won't have time to dig through things.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-xl"
              >
                <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                  <Clock size={15} />
                  Check every 6 months
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Replace expired food, water, and medications. Update documents. Set a calendar reminder.
                </p>
              </motion.div>
            </motion.div>

            {/* Right: Accordion checklist */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-sm tracking-widest text-[#FF6A00] font-medium uppercase mb-3">Pack it now, not later</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-3">
                  Your Emergency Go-Bag
                </h2>
                <p className="text-gray-500 leading-relaxed mb-8 max-w-lg">
                  If you only do one thing after reading this page, let it be this: pack a bag tonight. It takes 20 minutes and could save your family.
                </p>
              </motion.div>

              <div className="space-y-3">
                {goBagCategories.map((cat, i) => (
                  <GoBagCategory key={cat.title} {...cat} delay={i * 0.08} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FIRST AID ─── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-sm tracking-widest text-red-500 font-medium uppercase mb-3">Basic Life-Saving Skills</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937]">First Aid Essentials</h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
                <Phone size={15} className="text-red-500" />
                <span className="text-sm text-red-700">For serious injuries, always call <span className="font-bold">911</span></span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {firstAidBasics.map((aid, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">{aid.emoji}</span>
                    <h3 className="text-lg font-bold text-[#1F2937]">{aid.title}</h3>
                  </div>
                  <ol className="space-y-3">
                    {aid.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 text-red-500 text-xs font-bold flex items-center justify-center mt-0.5">
                          {stepIdx + 1}
                        </span>
                        <span className="text-sm text-gray-600 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SAFETY DO'S & DON'TS ─── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#26343A] overflow-hidden relative">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#FF6A00]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-1/6 w-[300px] h-[300px] bg-blue-500/6 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm tracking-widest text-[#FF6A00] font-medium uppercase mb-3">Stay Sharp, Stay Safe</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Do's and Don'ts</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Simple rules that our responders wish everyone followed. They could mean the difference between safety and danger.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Do's */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-green-400">Do</h3>
              </div>
              <div className="space-y-3">
                {safetyDos.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 p-4 bg-white/[0.06] border border-white/[0.08] rounded-xl hover:bg-white/[0.1] transition-colors"
                  >
                    <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Don'ts */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-red-400">Don't</h3>
              </div>
              <div className="space-y-3">
                {safetyDonts.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 p-4 bg-white/[0.06] border border-white/[0.08] rounded-xl hover:bg-white/[0.1] transition-colors"
                  >
                    <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── EVACUATION CENTERS ─── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-sm tracking-widest text-[#22C55E] font-medium uppercase mb-3">Know Before You Go</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-5">Evacuation Centers</h2>
                <p className="text-gray-500 leading-relaxed mb-8 max-w-lg">
                  Don't wait until the flood to figure out where to go. Visit these locations during calm weather so the route feels familiar when it matters.
                </p>
              </motion.div>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="relative p-6 bg-green-50 border border-green-100 rounded-2xl"
                >
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-500 text-white rounded-full">Primary</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F2937] mb-1">Barangay 180 Multi-Purpose Hall</h4>
                      <p className="text-sm text-gray-500">Main evacuation center with food supplies, medical station, and sleeping area. Capacity: ~500 residents.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-blue-50 border border-blue-100 rounded-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F2937] mb-1">Secondary: Covered Courts & Safe Zones</h4>
                      <p className="text-sm text-gray-500">Backup locations activated when the primary center reaches capacity. Consult the barangay office for the nearest one to your home.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right: Volunteer image */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-green-500/8 to-blue-500/8 rounded-[28px] blur-[30px]" />
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <ImageWithFallback
                    src={volunteerImage}
                    alt="Emergency responders conducting flood rescue training"
                    className="w-full h-72 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#26343A]/60 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative bg-[#26343A] rounded-3xl p-10 md:p-16 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6A00] rounded-full blur-[120px] opacity-15" />
            <div className="absolute bottom-0 left-0 w-52 h-52 bg-blue-500 rounded-full blur-[100px] opacity-10" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full mb-5">
                  <HandHeart size={14} className="text-[#FF6A00]" />
                  <span className="text-sm text-gray-300">Be part of the team</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Want to help your neighbors?</h2>
                <p className="text-gray-400 leading-relaxed">
                  Join our volunteer emergency response team. We'll train you on evacuation protocols, first aid, and rescue coordination. No experience needed — just heart.
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:flex-shrink-0">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FF6A00] text-white rounded-xl font-medium hover:bg-[#E55F00] transition-all shadow-lg shadow-orange-500/25"
                >
                  <Users size={16} />
                  Volunteer Now
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/[0.08] border border-white/15 text-white rounded-xl font-medium hover:bg-white/[0.14] transition-all"
                >
                  <Phone size={16} />
                  Contact Barangay
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
