import { useNotificationStore } from "../store/notificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const NotificationContainer = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  // Helper to fetch type styles & icons
  const getTypeStyles = (type) => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-450 shrink-0" />,
          borderColor: "border-emerald-500/20",
          glowColor: "shadow-emerald-500/5",
          accentBar: "bg-emerald-500",
        };
      case "error":
        return {
          icon: <AlertCircle className="h-5 w-5 text-rose-450 shrink-0" />,
          borderColor: "border-rose-500/20",
          glowColor: "shadow-rose-500/5",
          accentBar: "bg-rose-500",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
          borderColor: "border-amber-500/20",
          glowColor: "shadow-amber-500/5",
          accentBar: "bg-amber-505",
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-indigo-400 shrink-0" />,
          borderColor: "border-indigo-500/20",
          glowColor: "shadow-indigo-500/5",
          accentBar: "bg-indigo-500",
        };
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-[340px] pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {notifications.map((n) => {
          const styles = getTypeStyles(n.type);
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`pointer-events-auto w-full relative flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/90 border ${styles.borderColor} backdrop-blur-md shadow-xl ${styles.glowColor} overflow-hidden`}
            >
              {/* Colored Side Accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.accentBar}`} />

              {/* Status Icon */}
              <div className="mt-0.5">{styles.icon}</div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-xs font-semibold text-slate-200 leading-relaxed break-words">
                  {n.message}
                </p>
              </div>

              {/* Manual Dismiss button */}
              <button
                onClick={() => removeNotification(n.id)}
                className="absolute top-3.5 right-3 text-slate-500 hover:text-slate-300 transition-colors p-1 hover:bg-slate-800/40 rounded-lg"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;
