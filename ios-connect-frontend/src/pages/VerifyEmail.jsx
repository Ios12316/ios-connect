import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowRight,
  Mail
} from "lucide-react";
import API from "../services/axios";
import { toast } from "../store/notificationStore";
import Navbar from "../components/Navbar";

const VerifyEmail = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending"); // pending, success, error
  const [message, setMessage] = useState("");
  const [emailForResend, setEmailForResend] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const triggerVerification = async () => {
      try {
        const response = await API.get(`/users/verify-email/${token}`);
        setStatus("success");
        setMessage(response.data.message || "Your email address has been verified successfully!");
        toast.success("Email verified!");
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification link is invalid or has expired.");
        toast.error("Verification failed");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      triggerVerification();
    }
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!emailForResend.trim() || !emailForResend.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setResendLoading(true);
    try {
      const response = await API.post("/users/resend-verification", {
        email: emailForResend.toLowerCase().trim()
      });
      toast.success(response.data.message || "A new verification link has been sent!");
      setEmailForResend("");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to resend link. Please try again.";
      toast.error(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center pt-28 pb-12 px-6 relative overflow-hidden">
      
      <Navbar />

      {/* Background radial glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md mt-6">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Email Verification</h2>
          <p className="text-slate-400 text-sm mt-2">Activating your student authentication token</p>
        </div>

        {/* Verification Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative"
        >
          {loading ? (
            <div className="text-center py-10 space-y-4">
              <div className="flex justify-center text-indigo-400">
                <Loader2 className="h-16 w-16 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-white">Verifying account...</h3>
              <p className="text-sm text-slate-400">Please wait while we validate your activation token.</p>
            </div>
          ) : status === "success" ? (
            <div className="text-center py-6 space-y-4">
              <div className="flex justify-center text-emerald-400">
                <CheckCircle className="h-16 w-16 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-white">Account Activated!</h3>
              <p className="text-sm text-slate-450 leading-relaxed">
                {message}
              </p>
              <div className="pt-4">
                <Link to="/login" className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/10 transition-all hover:scale-[1.01] active:scale-[0.99]">
                  Go to Sign In
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-4 space-y-2">
                <div className="flex justify-center text-rose-400">
                  <XCircle className="h-16 w-16" />
                </div>
                <h3 className="text-lg font-bold text-white">Verification Failed</h3>
                <p className="text-sm text-slate-450 leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="border-t border-slate-800/60 pt-6">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Request New Link</h4>
                <form onSubmit={handleResend} className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      value={emailForResend}
                      onChange={(e) => setEmailForResend(e.target.value)}
                      placeholder="yourname@student.edu"
                      className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-slate-250 text-sm placeholder-slate-600 transition-all outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resendLoading || !emailForResend.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-semibold transition-all disabled:opacity-50"
                  >
                    {resendLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Resend Verification Link"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;
