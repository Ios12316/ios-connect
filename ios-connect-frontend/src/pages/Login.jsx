import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";
import API from "../services/axios";
import { AuthContext } from "../context/Context";
import { toast } from "../store/notificationStore";
import Navbar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.email.trim() !== "" &&
      formData.email.includes("@") &&
      formData.password.length >= 6
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please enter a valid email and password (min 6 chars)");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/users/login", {
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      toast.success(response.data.message || "Welcome back!");
      
      // Save authenticated user and token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data.user) {
        setUser(response.data.user);
      }
      
      // Redirect to dashboard page
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Invalid email or password.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to access your university dashboard</p>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Student Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@student.edu"
                  className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-slate-250 text-sm placeholder-slate-600 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-12 text-slate-250 text-sm placeholder-slate-600 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-350 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Platform
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>
        </motion.div>

        {/* Existing account link */}
        <div className="text-center mt-6 text-sm text-slate-500">
          New to IOS Connect?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;