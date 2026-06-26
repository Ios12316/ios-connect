import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Scale, ShieldAlert, Users, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-28 pb-12 px-6 relative overflow-hidden">
      <Navbar />

      {/* Background radial glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto mt-6 flex-1">
        
        {/* Back Navigation Arrow */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-semibold mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        {/* Title */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-white">Terms of Use</h2>
          <p className="text-slate-400 text-sm mt-2">Last updated: June 2026</p>
        </div>

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl space-y-8"
        >
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <GraduationCap className="h-5 w-5" />
              <h4>1. Acceptance of Terms</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Welcome to IOS Connect. By accessing or using our platform, services, or features, you agree to comply with and be bound by these Terms of Use. If you do not agree, please do not use the platform.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Users className="h-5 w-5" />
              <h4>2. Student Account Registration & Eligibility</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              IOS Connect is restricted to verified university students. During registration, you must provide valid, accurate, and current information, including a mandatory verified email and active Nigerian phone number. You are solely responsible for maintaining account confidentiality.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <ShoppingBag className="h-5 w-5" />
              <h4>3. Marketplace & Resource Trading Code</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              The marketplace allows students to list items, services, or roommate inquiries. You represent and warrant that any listing you post is truthful, lawful, and does not violate university regulations or local laws. IOS Connect does not handle transactions directly and is not responsible for trade outcomes.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <ShieldAlert className="h-5 w-5" />
              <h4>4. Community Guidelines & Prohibited Conduct</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Harassment, spam, fraudulent claims, or posting offensive material inside student forums or chats is strictly prohibited. Violators will face immediate account suspension and, if necessary, reports to university administrative bodies.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Scale className="h-5 w-5" />
              <h4>5. Disclaimer of Liability</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              IOS Connect is provided "as is" and "as available". We make no warranties of any kind regarding security, uptime, or correctness of content posted by other students. Use the platform responsibly.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfUse;
