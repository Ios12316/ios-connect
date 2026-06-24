import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Context";
import { GraduationCap } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background radial glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

        <div className="text-center flex flex-col items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 animate-bounce">
            <GraduationCap className="h-8 w-8 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-pink-500 animate-bounce" />
          </div>
          <p className="text-xs text-slate-500 tracking-widest uppercase font-semibold mt-2">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
