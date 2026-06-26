import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  Menu, 
  X, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2, 
  Shield, 
  Zap, 
  Sparkles,
  Search,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import ContactModal from "../components/ContactModal";

const Home = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const heroBgs = [
    '/students-hero.png',
    '/hero-bg-1.png',
    '/hero-bg-2.png',
    '/hero-bg-3.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBgs.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);


  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const features = [
    {
      title: "Student Marketplace",
      description: "Buy and sell textbooks, electronics, fashion, or even transfer hostel spaces safely within your campus community.",
      icon: ShoppingBag,
      color: "from-amber-500 to-orange-600",
      tag: "Trade Safe",
      benefits: ["Local campus handovers", "Student-only buyers", "Zero middleman fees"]
    },
    {
      title: "Roommate Matcher",
      description: "Search and connect with students matching your budget, preferred location, lifestyle habits, and roommate gender.",
      icon: Users,
      color: "from-emerald-500 to-teal-600",
      tag: "Live Together",
      benefits: ["Filter by budget & gender", "Detailed living preference profiles", "Chat directly before meeting"]
    },
    {
      title: "Study Partner Finder",
      description: "Match with students taking your exact courses to coordinate study groups, prepare for exams, and share notes.",
      icon: BookOpen,
      color: "from-indigo-500 to-blue-600",
      tag: "Learn Better",
      benefits: ["Search by course codes", "Match by study location preference", "Coordinate availability times"]
    },
    {
      title: "Campus Forum & Chats",
      description: "Share campus news, ask questions, write comments, and chat in real-time with students across different faculties.",
      icon: MessageSquare,
      color: "from-pink-500 to-rose-600",
      tag: "Stay Connected",
      benefits: ["Faculty & general forums", "Interactive nested comments", "Instant private messaging"]
    }
  ];

  const stats = [
    { value: "5,000+", label: "Active Students" },
    { value: "1,200+", label: "Marketplace Listings" },
    { value: "850+", label: "Roommates Matched" },
    { value: "400+", label: "Study Partnerships" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden relative w-full transition-colors duration-300">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-24 md:pt-16 isolate">
        
        {/* Background Student Images with smooth crossfades */}
        {heroBgs.map((bg, idx) => (
          <div 
            key={bg}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20 transition-opacity duration-1000 ease-in-out"
            style={{ 
              backgroundImage: `url('${bg}')`,
              opacity: currentBgIndex === idx ? 1 : 0
            }}
          />
        ))}
        {/* Gradient Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/70 to-slate-950/45 -z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent -z-10" />

        <div className="max-w-7xl mx-auto px-6 w-full text-center md:text-left grid md:grid-cols-12 gap-12 items-center">
          
          {/* Hero Details */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="md:col-span-7 flex flex-col justify-center"
          >
            {/* Small Badge */}
            <motion.div 
              variants={fadeIn}
              className="inline-flex items-center gap-2 self-center md:self-start px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-6 uppercase tracking-wider"
            >
              <Sparkles className="h-3 w-3" />
              Empowering Student Collaboration
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={fadeIn}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
            >
              Connect, Trade, and{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Thrive Together
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={fadeIn}
              className="text-slate-350 text-base sm:text-lg lg:text-xl max-w-xl mb-10 leading-relaxed"
            >
              Your ultimate university digital ecosystem. Find compatible roommates, connect with study partners, trade gear on the campus marketplace, and join student-wide discussions.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Link 
                to="/register" 
                className="flex items-center justify-center gap-2 group px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              >
                Get Started Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a 
                href="#features" 
                className="flex items-center justify-center px-8 py-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-900 hover:border-slate-700 font-semibold backdrop-blur-sm transition-all duration-300"
              >
                Explore Features
              </a>
            </motion.div>
          </motion.div>

          {/* Quick Connect Glassmorphism Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:col-span-5 hidden lg:block"
          >
            <div className="relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-lg shadow-2xl">
              {/* Outer light glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-3xl pointer-events-none" />
              
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                Active Student Hub
              </h3>
              
              {/* Featured Services Mini Cards */}
              <div className="space-y-4 relative z-10">
                <div className="flex gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-850 hover:border-slate-800 transition-colors">
                  <div className="p-2.5 h-10 w-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Marketplace Listing</h4>
                    <p className="text-xs text-slate-400 mt-1">"Selling Calculus 101 textbook - #2,000 (Excellent Condition)"</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-850 hover:border-slate-800 transition-colors">
                  <div className="p-2.5 h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Roommate Request</h4>
                    <p className="text-xs text-slate-400 mt-1">"Looking for male roommate for off-campus flat - Budget #150,000"</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-850 hover:border-slate-800 transition-colors">
                  <div className="p-2.5 h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Study Partnership</h4>
                    <p className="text-xs text-slate-400 mt-1">"Seeking study partner for PHY 102 exam prep - Library, evenings"</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  247 Students Online
                </span>
                <span>AAUA Campus Network</span>
              </div>
            </div>
          </motion.div>

        </div>
      </header>

      {/* STATS SECTION */}
      <section id="stats" className="py-20 border-y border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              Comprehensive Services
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need in One Hub
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Ditch the generic chat groups and messy bulletin boards. Connect with verified students for marketplace trading, roommates, and learning.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  whileHover={{ y: -6 }}
                  className="relative p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900 hover:border-indigo-500/20 dark:hover:border-slate-800/80 transition-all duration-300 overflow-hidden group shadow-lg"
                >
                  {/* Subtle background gradient glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-[0.03] group-hover:opacity-[0.08] blur-2xl transition-opacity duration-300 -z-10`} />
                  
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Top Header Card */}
                      <div className="flex justify-between items-center mb-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-950 py-1.5 px-3 rounded-full border border-slate-200 dark:border-slate-900">
                          {feature.tag}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                        {feature.description}
                      </p>
                    </div>

                    {/* Benefit List */}
                    <ul className="space-y-3.5 border-t border-slate-200 dark:border-slate-900/80 pt-6">
                      {feature.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-3 text-xs md:text-sm text-slate-650 dark:text-slate-350">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US (ABOUT SECTION) */}
      <section id="about" className="py-24 bg-white dark:bg-slate-950 relative border-t border-slate-200 dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/30 p-1">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-transparent blur-xl -z-10" />
                <div className="space-y-6 p-8 relative z-10">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 mt-1">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Verified Students Only</h4>
                      <p className="text-xs text-slate-650 dark:text-slate-400 mt-1 leading-relaxed">Every account is bound to a verified school domain or student identification to secure the platform.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-500 dark:text-purple-400 mt-1">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Instant Notifications</h4>
                      <p className="text-xs text-slate-655 dark:text-slate-400 mt-1 leading-relaxed">Receive updates immediately when someone offers to buy your items, matches your roommate listing, or comments on your post.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-3 rounded-2xl bg-pink-500/15 text-pink-500 dark:text-pink-400 mt-1">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Tailored Profiles</h4>
                      <p className="text-xs text-slate-655 dark:text-slate-400 mt-1 leading-relaxed">Showcase your school faculty, department, entry level, and biographic details to build trust and relevance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description Column */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">Campus Safe Network</h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">Designed for Seamless Integration into Student Life</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                University life presents unique challenges—from expensive textbooks to high rent and academic isolation. IOS Connect bridges these gaps by hosting a centralized platform exclusively accessible to college students.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
                Whether you're looking for cheap study materials, trying to find a compatible roommate to split rent with, or asking senior peers for guidance on course registration, IOS Connect coordinates everything under one roof.
              </p>
              <div>
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 group px-6 py-3.5 bg-slate-900 dark:bg-slate-900 border border-slate-850 dark:border-slate-800 text-white rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-850 transition-all duration-300"
                >
                  Create Your Account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CALL TO ACTION CARD */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-950 border border-slate-800/80 p-6 sm:p-12 md:p-16 text-center shadow-2xl overflow-hidden"
          >
            {/* Ambient background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Connect With Your Campus Today
            </h3>
            <p className="text-slate-350 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Ready to take control of your student life? Join thousands of peers trading items, sharing apartments, and conquering academics together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-300"
              >
                Join Now
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 rounded-2xl font-semibold transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-slate-950 border-t border-slate-900/60 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-10">
          
          {/* Logo / Brand Info */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white">IOS Connect</span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              A private campus networking platform designed to improve student connections, ease student commerce, and facilitate community-driven solutions.
            </p>
            <div className="flex gap-4">
              {/* Mock Social Links */}
              <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-indigo-400 hover:bg-slate-900/80 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-indigo-400 hover:bg-slate-900/80 transition-colors">
                <Search className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-indigo-400 hover:bg-slate-900/80 transition-colors">
                <HelpCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-5">Platform</h4>
            <ul className="space-y-3.5 text-xs sm:text-sm">
              <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Services</a></li>
              <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors">Join Community</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">User Login</Link></li>
              <li><a href="#stats" className="text-slate-400 hover:text-white transition-colors">Activity Stats</a></li>
            </ul>
          </div>

          {/* Features Column */}
          <div className="md:col-span-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-5">Features</h4>
            <ul className="space-y-3.5 text-xs sm:text-sm">
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Roommate Finder</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Study Partners</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Student Forum</Link></li>
            </ul>
          </div>

          {/* Support / Contact */}
          <div className="md:col-span-2">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-5">Contact Support</h4>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400">
              <li>
                <a href="https://wa.me/2348137451940" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Support
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setIsContactOpen(true)} 
                  className="hover:text-white transition-colors text-left focus:outline-none"
                >
                  Help Request Form
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider / Bottom */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs text-center sm:text-left">
            &copy; 2026 IOS Connect. Created with love for university campuses. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

    </div>
  );
};

export default Home;
