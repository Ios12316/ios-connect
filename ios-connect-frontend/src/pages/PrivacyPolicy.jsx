import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Database, Lock, UserCheck } from "lucide-react";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
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
          <h2 className="text-3xl font-extrabold text-white">Privacy Policy</h2>
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
              <Eye className="h-5 w-5" />
              <h4>1. Information We Collect</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              We collect information that you directly provide to us during account creation and profile updates. This includes your name, email address, password, phone number, gender, academic faculty, department, level, entry year, bio, and uploaded profile pictures.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Database className="h-5 w-5" />
              <h4>2. How We Use Your Data</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              We process your details to establish your campus identity, personalize your dashboard, matching roommate requests, facilitate secure resource sharing, display student listings, and send security/verification emails. Your phone number is utilized strictly for verification and connecting verified contacts.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Lock className="h-5 w-5" />
              <h4>3. Security and Storage</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              We implement industry-standard encryption practices to secure passwords (via bcrypt hashing) and verification tokens. All media assets are stored safely on Cloudinary's secure media servers. While we take every measure to protect your data, no network is 100% secure.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <UserCheck className="h-5 w-5" />
              <h4>4. Data Sharing and Privacy Control</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              IOS Connect will never sell, rent, or distribute your private contact details to external advertisers. Academic details and profile pictures are shared selectively with campus peers to support interaction on the marketplace, forums, and partner boards.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Shield className="h-5 w-5" />
              <h4>5. Your Privacy Rights</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              You can view, edit, or remove optional profile information at any time from your account settings. If you wish to delete your account and remove your data permanently from our servers, you can submit a support inquiry through the contact form.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
