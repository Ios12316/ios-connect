import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  BookOpen, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  Camera, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Tag, 
  ChevronRight,
  Trash2,
  Check,
  UserCheck,
  Mail,
  Send,
  ArrowLeft
} from "lucide-react";
import API from "../services/axios";
import { AuthContext } from "../context/Context";
import { toast } from "../store/notificationStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);
  
  // Dashboard navigation states
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sub-module states
  const [feedPosts, setFeedPosts] = useState([]);
  const [roommatePosts, setRoommatePosts] = useState([]);
  const [studyPosts, setStudyPosts] = useState([]);
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  
  // Form modal states
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [isRoommateModalOpen, setIsRoommateModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isMarketplaceModalOpen, setIsMarketplaceModalOpen] = useState(false);
  const [selectedMarketplaceItem, setSelectedMarketplaceItem] = useState(null);

  // Loading states
  const [dataLoading, setDataLoading] = useState(false);

  // Input states for creating objects
  const [feedInput, setFeedInput] = useState({ content: "" });
  const [roommateInput, setRoommateInput] = useState({
    gender: user?.gender || "Male",
    preferredGender: "Any",
    location: "",
    budget: "",
    description: ""
  });
  const [studyInput, setStudyInput] = useState({
    title: "",
    course: "",
    location: "",
    availability: "",
    description: ""
  });
  const [marketplaceInput, setMarketplaceInput] = useState({
    title: "",
    description: "",
    price: "",
    category: "Other",
    phoneNumber: ""
  });

  // Profile Edit state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    gender: user?.gender || "",
    faculty: user?.faculty || "",
    department: user?.department || "",
    level: user?.level || "",
    entryYear: user?.entryYear || "",
    bio: user?.bio || ""
  });

  // Comment / Forum Reply states
  const [expandedComments, setExpandedComments] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [newCommentText, setNewCommentText] = useState({});

  // Direct Message states
  const [myChats, setMyChats] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [activeConversation, setActiveConversation] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [chatsLoading, setChatsLoading] = useState(false);
  const [convLoading, setConvLoading] = useState(false);

  // Notifications states
  const [notifications, setNotifications] = useState([]);

  // Load data based on active tab
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setDataLoading(true);
      try {
        if (activeTab === "feed") {
          const response = await API.get("/community/feed");
          setFeedPosts(response.data.posts || []);
        } else if (activeTab === "roommates") {
          const response = await API.get("/roommates");
          setRoommatePosts(response.data.posts || []);
        } else if (activeTab === "study") {
          const response = await API.get("/study-partners");
          setStudyPosts(response.data.posts || []);
        } else if (activeTab === "marketplace") {
          const response = await API.get("/marketplace");
          setMarketplacePosts(response.data.listings || []);
        } else if (activeTab === "messages") {
          setChatsLoading(true);
          try {
            const response = await API.get("/messages/my-chats");
            setMyChats(response.data.chats || []);
          } catch (err) {
            console.error("Error fetching chats:", err);
          } finally {
            setChatsLoading(false);
          }
        } else if (activeTab === "overview") {
          // prefetch counts or feeds
          const [feedRes, roommateRes, studyRes, marketRes] = await Promise.all([
            API.get("/community/feed").catch(() => ({ data: { posts: [] } })),
            API.get("/roommates").catch(() => ({ data: { posts: [] } })),
            API.get("/study-partners").catch(() => ({ data: { posts: [] } })),
            API.get("/marketplace").catch(() => ({ data: { listings: [] } }))
          ]);
          setFeedPosts(feedRes.data.posts || []);
          setRoommatePosts(roommateRes.data.posts || []);
          setStudyPosts(studyRes.data.posts || []);
          setMarketplacePosts(marketRes.data.listings || []);
        }
      } catch (err) {
        console.error("Error fetching tab data:", err);
        toast.error("Failed to load records");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  // Synchronize profile form when user context becomes available
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        gender: user.gender || "",
        faculty: user.faculty || "",
        department: user.department || "",
        level: user.level || "",
        entryYear: user.entryYear || "",
        bio: user.bio || ""
      });
      setRoommateInput(prev => ({ ...prev, gender: user.gender || "Male" }));
    }
  }, [user]);

  const markMessagesAsRead = async (senderId) => {
    if (!senderId) return;
    const unreadMsgs = notifications.filter(
      n => n.type === "message" && !n.isRead && (n.sender?._id === senderId || n.sender === senderId)
    );
    if (unreadMsgs.length === 0) return;

    try {
      await Promise.all(
        unreadMsgs.map(notif => API.put(`/notifications/${notif._id}/read`))
      );
      setNotifications(prev =>
        prev.map(n =>
          n.type === "message" && (n.sender?._id === senderId || n.sender === senderId) ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notifications read:", err);
    }
  };

  // Poll notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const response = await API.get("/notifications");
        const newNotifications = response.data.notifications || [];
        
        setNotifications(prev => {
          if (prev.length > 0) {
            const prevIds = new Set(prev.map(n => n._id));
            newNotifications.forEach(n => {
              if (!n.isRead && !prevIds.has(n._id)) {
                const senderName = n.sender?.fullName || "Someone";
                toast.info(`${senderName}: ${n.message}`);
              }
            });
          }
          return newNotifications;
        });
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [user]);

  // Mark read when selected chat user changes
  useEffect(() => {
    if (selectedChatUser) {
      markMessagesAsRead(selectedChatUser._id);
    }
  }, [selectedChatUser, notifications]);

  // Poll conversation if a chat is active
  useEffect(() => {
    if (activeTab !== "messages" || !selectedChatUser) return;

    const fetchConv = async () => {
      try {
        const response = await API.get(`/messages/conversation/${selectedChatUser._id}`);
        setActiveConversation(response.data.messages || []);
      } catch (err) {
        console.error("Failed to poll message updates:", err);
      }
    };

    fetchConv();
    const interval = setInterval(fetchConv, 4000);

    return () => clearInterval(interval);
  }, [activeTab, selectedChatUser]);

  // Comment / Forum Reply Handlers
  const toggleComments = async (postId) => {
    const isExpanded = !expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: isExpanded }));
    if (isExpanded) {
      try {
        const response = await API.get(`/comments/${postId}`);
        setCommentsByPost(prev => ({ ...prev, [postId]: response.data.comments || [] }));
      } catch (err) {
        toast.error("Failed to load replies");
      }
    }
  };

  const handleCreateComment = async (e, postId) => {
    if (e) e.preventDefault();
    const text = newCommentText[postId]?.trim();
    if (!text) return;
    try {
      const response = await API.post("/comments", { postId, content: text });
      const newComment = {
        ...response.data.comment,
        user: {
          _id: user._id,
          fullName: user.fullName,
          profilePicture: user.profilePicture
        }
      };
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      setNewCommentText(prev => ({ ...prev, [postId]: "" }));
      toast.success("Reply added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add reply");
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(c => c._id !== commentId)
      }));
      toast.success("Reply deleted");
    } catch (err) {
      toast.error("Failed to delete reply");
    }
  };

  // Direct Message Handlers
  const startDirectMessage = async (otherUser) => {
    if (!otherUser || otherUser._id === user?._id) return;
    
    setSelectedMarketplaceItem(null);
    setSelectedChatUser(otherUser);
    setActiveTab("messages");
    
    setConvLoading(true);
    try {
      const response = await API.get(`/messages/conversation/${otherUser._id}`);
      setActiveConversation(response.data.messages || []);
    } catch (err) {
      console.error("Error opening conversation:", err);
    } finally {
      setConvLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!selectedChatUser || !messageInput.trim()) return;
    const content = messageInput.trim();
    setMessageInput("");
    try {
      const response = await API.post("/messages/send", {
        receiverId: selectedChatUser._id,
        content
      });
      
      const newMsg = response.data.message;
      setActiveConversation(prev => [...prev, newMsg]);
      
      const chatListRes = await API.get("/messages/my-chats");
      setMyChats(chatListRes.data.chats || []);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  // Handles logout
  const handleLogoutClick = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // POST creators
  const handleCreateFeed = async (e) => {
    e.preventDefault();
    if (!feedInput.content.trim()) return;
    try {
      const response = await API.post("/community", { content: feedInput.content });
      setFeedPosts(prev => [response.data.post, ...prev]);
      setFeedInput({ content: "" });
      setIsFeedModalOpen(false);
      toast.success("Post shared successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post");
    }
  };

  const handleCreateRoommate = async (e) => {
    e.preventDefault();
    if (!roommateInput.location || !roommateInput.budget || !roommateInput.description) {
      toast.error("All fields are required");
      return;
    }
    try {
      const response = await API.post("/roommates", {
        ...roommateInput,
        budget: Number(roommateInput.budget)
      });
      // Append poster detail manually so we don't have to refetch
      const newPost = {
        ...response.data.roommatePost,
        user: { 
          _id: user._id, 
          fullName: user.fullName, 
          profilePicture: user.profilePicture,
          faculty: user.faculty,
          department: user.department
        }
      };
      setRoommatePosts(prev => [newPost, ...prev]);
      setRoommateInput({
        gender: user?.gender || "Male",
        preferredGender: "Any",
        location: "",
        budget: "",
        description: ""
      });
      setIsRoommateModalOpen(false);
      toast.success("Roommate request listed!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list");
    }
  };

  const handleCreateStudy = async (e) => {
    e.preventDefault();
    if (!studyInput.title || !studyInput.course || !studyInput.location || !studyInput.availability || !studyInput.description) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const response = await API.post("/study-partners", studyInput);
      const newPost = {
        ...response.data.post,
        user: { 
          _id: user._id, 
          fullName: user.fullName, 
          profilePicture: user.profilePicture,
          faculty: user.faculty,
          department: user.department
        }
      };
      setStudyPosts(prev => [newPost, ...prev]);
      setStudyInput({
        title: "",
        course: "",
        location: "",
        availability: "",
        description: ""
      });
      setIsStudyModalOpen(false);
      toast.success("Study partner request created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create study request");
    }
  };

  const handleCreateMarketplace = async (e) => {
    e.preventDefault();
    if (!marketplaceInput.title || !marketplaceInput.price || !marketplaceInput.description) {
      toast.error("Title, Price and Description are required");
      return;
    }
    try {
      const response = await API.post("/marketplace", {
        ...marketplaceInput,
        price: Number(marketplaceInput.price)
      });
      const newPost = {
        ...response.data.listing,
        user: { 
          _id: user._id, 
          fullName: user.fullName, 
          profilePicture: user.profilePicture,
          email: user.email,
          faculty: user.faculty,
          department: user.department,
          level: user.level,
          bio: user.bio
        }
      };
      setMarketplacePosts(prev => [newPost, ...prev]);
      setMarketplaceInput({
        title: "",
        description: "",
        price: "",
        category: "Other",
        phoneNumber: ""
      });
      setIsMarketplaceModalOpen(false);
      toast.success("Item listed in marketplace!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list item");
    }
  };

  // DELETE handlers
  const handleDeletePost = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      if (type === "feed") {
        await API.delete(`/community/${id}`);
        setFeedPosts(prev => prev.filter(p => p._id !== id));
      } else if (type === "roommates") {
        await API.delete(`/roommates/${id}`);
        setRoommatePosts(prev => prev.filter(p => p._id !== id));
      } else if (type === "study") {
        await API.delete(`/study-partners/${id}`);
        setStudyPosts(prev => prev.filter(p => p._id !== id));
      } else if (type === "marketplace") {
        await API.delete(`/marketplace/${id}`);
        setMarketplacePosts(prev => prev.filter(p => p._id !== id));
      }
      toast.success("Deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  // Action status updaters
  const handleResolveRoommate = async (id) => {
    try {
      const res = await API.put(`/roommates/${id}/found`);
      setRoommatePosts(prev => prev.map(p => p._id === id ? { ...p, isFilled: true } : p));
      toast.success("Marked as roommate found!");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleResolveStudy = async (id) => {
    try {
      const res = await API.put(`/study-partners/${id}/close`);
      setStudyPosts(prev => prev.map(p => p._id === id ? { ...p, isClosed: true } : p));
      toast.success("Study partner request closed!");
    } catch (err) {
      toast.error("Failed to close request");
    }
  };

  // Profile Update handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/users/profile", profileForm);
      setUser(res.data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  // Helper to fetch unread notification counts per tab
  const getUnreadCount = (tabId) => {
    if (tabId === "messages") {
      return notifications.filter(n => n.type === "message" && !n.isRead).length;
    }
    if (tabId === "feed") {
      return notifications.filter(n => n.type === "comment" && !n.isRead).length;
    }
    return 0;
  };

  // Sidebar list
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "feed", label: "Class Forum", icon: MessageSquare },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "roommates", label: "Roommate Finder", icon: Users },
    { id: "study", label: "Study Partners", icon: BookOpen },
    { id: "marketplace", label: "Student Marketplace", icon: ShoppingBag },
    { id: "settings", label: "Profile Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex relative overflow-x-hidden w-full transition-colors duration-300">
      
      {/* Background radial glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* SIDEBAR - DESKTOP */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/95 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800/80 backdrop-blur-xl flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:relative lg:flex"}`}>
        
        {/* Sidebar Header */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:scale-105 active:scale-95 transition-all duration-200"
                title="Go Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-md font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                IOS Connect
              </span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const count = getUnreadCount(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-indigo-400 border-l-4 border-indigo-500 shadow-md shadow-indigo-500/5" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {count > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-[10px] font-black text-white leading-none animate-pulse">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Student Logged In) */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 flex flex-col gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-indigo-650 flex items-center justify-center font-bold text-white shadow-inner shrink-0">
              {user?.fullName ? user.fullName[0].toUpperCase() : "S"}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-950 hover:bg-rose-950/10 text-xs font-semibold transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out Session
          </button>
        </div>

      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-0">
        
        {/* MOBILE HEADER */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-slate-100/90 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:scale-105 active:scale-95 transition-all duration-200 mr-1"
              title="Go Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="p-1.5 rounded-lg bg-indigo-500 text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-850 dark:text-slate-100">IOS Connect</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-955 dark:hover:text-slate-200"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT BODY */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              
              {/* SUBTAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Greeting banner */}
                  <div className="bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div>
                      <h1 className="text-2xl md:text-3xl font-extrabold text-white">Hello, {user?.fullName}!</h1>
                      <p className="text-slate-400 text-sm mt-1.5">Here is what is happening today in your department.</p>
                      <div className="flex flex-wrap gap-2.5 mt-4">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">{user?.department}</span>
                        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400">{user?.level}</span>
                        <span className="px-3 py-1 rounded-full bg-slate-850 text-xs text-slate-400 border border-slate-850">{user?.faculty}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex gap-2">
                      <button 
                        onClick={() => setActiveTab("settings")}
                        className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-350 hover:text-slate-200 hover:bg-slate-900 text-xs font-bold transition-all"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Summary Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Department Feed", value: feedPosts.length, icon: MessageSquare, tab: "feed", color: "from-blue-500 to-indigo-650" },
                      { label: "Roommate Requests", value: roommatePosts.filter(p => !p.isFilled).length, icon: Users, tab: "roommates", color: "from-pink-500 to-rose-650" },
                      { label: "Study Partner Posts", value: studyPosts.filter(p => !p.isClosed).length, icon: BookOpen, tab: "study", color: "from-amber-500 to-orange-600" },
                      { label: "Marketplace Items", value: marketplacePosts.filter(p => !p.isSold).length, icon: ShoppingBag, tab: "marketplace", color: "from-emerald-500 to-teal-650" },
                    ].map((card, i) => {
                      const Icon = card.icon;
                      return (
                        <div 
                          key={i}
                          onClick={() => setActiveTab(card.tab)}
                          className="bg-slate-900/30 hover:bg-slate-900/60 border border-slate-850 hover:border-indigo-500/30 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group hover:scale-[1.01]"
                        >
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} text-white w-10 h-10 flex items-center justify-center shadow-md`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-2xl font-black text-slate-100 mt-4">{dataLoading ? "..." : card.value}</p>
                          <p className="text-xs text-slate-500 font-semibold mt-1 group-hover:text-slate-400 transition-colors">{card.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Shortcuts / Recommendations */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Activity widget */}
                    <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-6 space-y-4">
                      <h3 className="text-md font-bold text-white flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-indigo-400" />
                        Classroom Board
                      </h3>
                      <p className="text-xs text-slate-500">Latest updates in {user?.department} ({user?.level})</p>
                      
                      {feedPosts.length === 0 ? (
                        <div className="text-center py-6 text-slate-650 text-xs">No updates posted yet.</div>
                      ) : (
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
                          {feedPosts.slice(0, 3).map((post) => (
                            <div key={post._id} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl text-xs space-y-1">
                              <div className="flex justify-between text-[10px] text-slate-500">
                                <span className="font-bold text-slate-400">{post.user?.fullName}</span>
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-slate-300 leading-relaxed truncate">{post.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <button 
                        onClick={() => setActiveTab("feed")}
                        className="w-full flex items-center justify-center gap-1 py-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Go to Forum <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Quick actions panel */}
                    <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-md font-bold text-white">Quick Actions</h3>
                        <p className="text-xs text-slate-500 mt-1">Easily reach out to peers, list rooms, or sell textbook items.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                          onClick={() => { setActiveTab("feed"); setIsFeedModalOpen(true); }}
                          className="flex items-center gap-2 p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-xs font-bold rounded-xl text-slate-300 transition-all hover:scale-[1.01]"
                        >
                          <MessageSquare className="h-4 w-4 text-blue-400" />
                          New Forum Post
                        </button>
                        <button
                          onClick={() => { setActiveTab("roommates"); setIsRoommateModalOpen(true); }}
                          className="flex items-center gap-2 p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-xs font-bold rounded-xl text-slate-300 transition-all hover:scale-[1.01]"
                        >
                          <Users className="h-4 w-4 text-pink-400" />
                          List Room
                        </button>
                        <button
                          onClick={() => { setActiveTab("study"); setIsStudyModalOpen(true); }}
                          className="flex items-center gap-2 p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-xs font-bold rounded-xl text-slate-300 transition-all hover:scale-[1.01]"
                        >
                          <BookOpen className="h-4 w-4 text-amber-400" />
                          Find Partner
                        </button>
                        <button
                          onClick={() => { setActiveTab("marketplace"); setIsMarketplaceModalOpen(true); }}
                          className="flex items-center gap-2 p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-xs font-bold rounded-xl text-slate-300 transition-all hover:scale-[1.01]"
                        >
                          <ShoppingBag className="h-4 w-4 text-emerald-400" />
                          Sell Textbook
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* SUBTAB 2: CLASS FORUM (FEED) */}
              {activeTab === "feed" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-white">Class Forum Feed</h1>
                      <p className="text-xs text-slate-500 mt-1">Discussions for {user?.department} - {user?.level}</p>
                    </div>
                    <button
                      onClick={() => setIsFeedModalOpen(true)}
                      className="flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      Create Post
                    </button>
                  </div>

                  {dataLoading ? (
                    <div className="text-center py-12 text-slate-500 text-sm">Loading classroom feed...</div>
                  ) : feedPosts.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-850 rounded-2xl text-slate-500 text-sm">
                      No forum discussions found for your department and level yet. Start the first topic!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedPosts.map((post) => (
                        <div key={post._id} className="bg-slate-900/30 border border-slate-850 rounded-2xl p-6 space-y-4 relative">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div 
                                onClick={() => post.user && post.user._id !== user._id && startDirectMessage(post.user)}
                                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${post.user?._id !== user._id ? "cursor-pointer hover:bg-indigo-700 transition-all hover:scale-105" : ""} bg-indigo-650`}
                                title={post.user?._id !== user._id ? "Send Direct Message" : ""}
                              >
                                {post.user?.fullName ? post.user.fullName[0].toUpperCase() : "S"}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-200">{post.user?.fullName}</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">{post.department} • {post.level} • {new Date(post.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            {/* Delete option for owners */}
                            {post.user?._id === user?._id && (
                              <button 
                                onClick={() => handleDeletePost(post._id, "feed")}
                                className="p-1.5 rounded-lg hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          
                          <p className="text-sm text-slate-350 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                          {/* Comments/Replies Section */}
                          <div className="pt-3 border-t border-slate-850/60 mt-3 space-y-4">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => toggleComments(post._id)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                {expandedComments[post._id] ? "Hide Replies" : "Show Replies"}
                              </button>
                            </div>

                            {expandedComments[post._id] && (
                              <div className="space-y-4 pt-2">
                                {/* Comment list */}
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                  {(commentsByPost[post._id] || []).length === 0 ? (
                                    <p className="text-[11px] text-slate-500 italic">No replies yet. Be the first to answer!</p>
                                  ) : (
                                    (commentsByPost[post._id] || []).map((comment) => (
                                      <div key={comment._id} className="bg-slate-950/40 border border-slate-900/80 rounded-xl p-3 flex justify-between items-start">
                                        <div className="flex items-start gap-2.5 min-w-0">
                                          <div 
                                            onClick={() => comment.user && comment.user._id !== user._id && startDirectMessage(comment.user)}
                                            className={`h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0 ${comment.user?._id !== user._id ? "cursor-pointer hover:bg-indigo-650 hover:text-white" : ""} transition-colors`}
                                            title={comment.user?._id !== user._id ? "Send Direct Message" : ""}
                                          >
                                            {comment.user?.fullName ? comment.user.fullName[0].toUpperCase() : "S"}
                                          </div>
                                          <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-200">
                                              {comment.user?.fullName}
                                              <span className="text-[9px] font-normal text-slate-500 ml-2">
                                                {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                              </span>
                                            </p>
                                            <p className="text-xs text-slate-350 mt-1 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                                          </div>
                                        </div>

                                        {comment.user?._id === user?._id && (
                                          <button
                                            onClick={() => handleDeleteComment(comment._id, post._id)}
                                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </button>
                                        )}
                                      </div>
                                    ))
                                  )}
                                </div>

                                {/* Reply Input form */}
                                <form onSubmit={(e) => handleCreateComment(e, post._id)} className="flex items-center gap-2 pt-2">
                                  <input
                                    type="text"
                                    value={newCommentText[post._id] || ""}
                                    onChange={(e) => setNewCommentText(p => ({ ...p, [post._id]: e.target.value }))}
                                    placeholder="Write a reply..."
                                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-indigo-500/50 transition-colors"
                                  />
                                  <button
                                    type="submit"
                                    className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-colors"
                                  >
                                    <Send className="h-3.5 w-3.5" />
                                  </button>
                                </form>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 3: ROOMMATE FINDER */}
              {activeTab === "roommates" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-white">Roommate Matcher</h1>
                      <p className="text-xs text-slate-500 mt-1">Browse and publish roommate accommodation listings</p>
                    </div>
                    <button
                      onClick={() => setIsRoommateModalOpen(true)}
                      className="flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      Publish Room
                    </button>
                  </div>

                  {dataLoading ? (
                    <div className="text-center py-12 text-slate-500 text-sm">Loading accommodation listings...</div>
                  ) : roommatePosts.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-850 rounded-2xl text-slate-500 text-sm">
                      No roommate search postings listed yet.
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {roommatePosts.map((post) => (
                        <div key={post._id} className="bg-slate-900/30 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                          {post.isFilled && (
                            <div className="absolute top-2.5 right-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Filled
                            </div>
                          )}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div 
                                onClick={() => post.user && post.user._id !== user._id && startDirectMessage(post.user)}
                                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${post.user?._id !== user._id ? "cursor-pointer hover:bg-pink-500 hover:scale-105 transition-all" : ""} bg-pink-650`}
                                title={post.user?._id !== user._id ? "Send Direct Message" : ""}
                              >
                                {post.user?.fullName ? post.user.fullName[0].toUpperCase() : "S"}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-200">{post.user?.fullName}</h4>
                                <p className="text-[10px] text-slate-500 truncate">{post.user?.department} • {post.user?.faculty}</p>
                              </div>
                            </div>
                            
                            <p className="text-xs text-slate-400 leading-relaxed min-h-12 line-clamp-3">{post.description}</p>
                            
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850/60 text-xs text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                                <span className="truncate">{post.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                                <span>₦{post.budget.toLocaleString()} / yr</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5 text-pink-400" />
                                <span>Pref: {post.preferredGender}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-850/60">
                            {post.user?._id === user?._id ? (
                              <>
                                {!post.isFilled && (
                                  <button
                                    onClick={() => handleResolveRoommate(post._id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 transition-all"
                                  >
                                    <Check className="h-3 w-3" /> Found roommate
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeletePost(post._id, "roommates")}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded-lg border border-rose-500/20 transition-all"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => startDirectMessage(post.user)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
                              >
                                <Mail className="h-3.5 w-3.5" /> Message Seeker
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 4: STUDY PARTNERS */}
              {activeTab === "study" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-white">Study Partner requests</h1>
                      <p className="text-xs text-slate-500 mt-1">Match with classmates for tutorials, projects, or group study</p>
                    </div>
                    <button
                      onClick={() => setIsStudyModalOpen(true)}
                      className="flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      Create Request
                    </button>
                  </div>

                  {dataLoading ? (
                    <div className="text-center py-12 text-slate-500 text-sm">Loading study requests...</div>
                  ) : studyPosts.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-850 rounded-2xl text-slate-500 text-sm">
                      No study requests created yet.
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {studyPosts.map((post) => (
                        <div key={post._id} className="bg-slate-900/30 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                          {post.isClosed && (
                            <div className="absolute top-2.5 right-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Closed
                            </div>
                          )}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div 
                                onClick={() => post.user && post.user._id !== user._id && startDirectMessage(post.user)}
                                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${post.user?._id !== user._id ? "cursor-pointer hover:bg-amber-500 hover:scale-105 transition-all" : ""} bg-amber-600`}
                                title={post.user?._id !== user._id ? "Send Direct Message" : ""}
                              >
                                {post.user?.fullName ? post.user.fullName[0].toUpperCase() : "S"}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-200">{post.user?.fullName}</h4>
                                <p className="text-[10px] text-slate-500 truncate">{post.user?.department} • {post.user?.faculty}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-bold text-slate-100">{post.title}</h3>
                              <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">{post.course}</p>
                            </div>
                            
                            <p className="text-xs text-slate-400 leading-relaxed min-h-12 line-clamp-3">{post.description}</p>
                            
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850/60 text-xs text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                                <span className="truncate">{post.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                <span>Pref: {post.availability}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-850/60">
                            {post.user?._id === user?._id ? (
                              <>
                                {!post.isClosed && (
                                  <button
                                    onClick={() => handleResolveStudy(post._id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20 transition-all"
                                  >
                                    <Check className="h-3 w-3" /> Mark Resolved
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeletePost(post._id, "study")}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded-lg border border-rose-500/20 transition-all"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => startDirectMessage(post.user)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
                              >
                                <Mail className="h-3.5 w-3.5" /> Message Partner
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 5: STUDENT MARKETPLACE */}
              {activeTab === "marketplace" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-white">Student Marketplace</h1>
                      <p className="text-xs text-slate-500 mt-1">Buy and sell textbooks, electronics, and daily essentials within campus</p>
                    </div>
                    <button
                      onClick={() => setIsMarketplaceModalOpen(true)}
                      className="flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      List Item
                    </button>
                  </div>

                  {dataLoading ? (
                    <div className="text-center py-12 text-slate-500 text-sm">Loading items...</div>
                  ) : marketplacePosts.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-850 rounded-2xl text-slate-500 text-sm">
                      No marketplace listings active yet.
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {marketplacePosts.map((post) => (
                        <div 
                          key={post._id} 
                          onClick={() => setSelectedMarketplaceItem(post)}
                          className="bg-slate-900/30 hover:bg-slate-900/60 border border-slate-850 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-200 cursor-pointer hover:scale-[1.01] shadow-lg shadow-black/10"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 justify-between">
                              <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-850 text-[10px] text-indigo-400 font-bold">{post.category}</span>
                              <span className="text-xs font-black text-emerald-455">₦{post.price.toLocaleString()}</span>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-bold text-slate-200 line-clamp-1">{post.title}</h3>
                              <p className="text-[10px] text-slate-500 mt-0.5">Listed by {post.user?.fullName || "Student"}</p>
                            </div>
                            
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{post.description}</p>
                          </div>

                          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-850/60">
                            {post.user?._id === user?._id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePost(post._id, "marketplace");
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-lg border border-rose-500/20 transition-all w-full justify-center"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Remove Listing
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 6: PROFILE SETTINGS */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Profile Settings</h1>
                    <p className="text-xs text-slate-500 mt-1">Manage your student details visible to colleagues</p>
                  </div>

                  <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-6 md:p-8">
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                          <input
                            type="text"
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm(p => ({ ...p, fullName: e.target.value }))}
                            className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-slate-250 text-sm outline-none transition-all"
                            required
                          />
                        </div>

                        {/* Gender */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                          <select
                            value={profileForm.gender}
                            onChange={(e) => setProfileForm(p => ({ ...p, gender: e.target.value }))}
                            className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-slate-250 text-sm outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                        {/* Faculty (readonly to protect student account setup) */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">Faculty (Read-Only)</label>
                          <input
                            type="text"
                            value={profileForm.faculty}
                            disabled
                            className="w-full bg-slate-950/40 border border-slate-900 text-slate-500 rounded-xl py-3 px-4 text-sm cursor-not-allowed"
                          />
                        </div>

                        {/* Department (readonly) */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">Department (Read-Only)</label>
                          <input
                            type="text"
                            value={profileForm.department}
                            disabled
                            className="w-full bg-slate-950/40 border border-slate-900 text-slate-500 rounded-xl py-3 px-4 text-sm cursor-not-allowed"
                          />
                        </div>

                        {/* Level */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Academic Level</label>
                          <select
                            value={profileForm.level}
                            onChange={(e) => setProfileForm(p => ({ ...p, level: e.target.value }))}
                            className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-slate-250 text-sm outline-none transition-all appearance-none cursor-pointer"
                          >
                            {["100 Level", "200 Level", "300 Level", "400 Level", "500 Level", "Spillover"].map((l) => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                        </div>

                        {/* Entry Year */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Entry Year</label>
                          <select
                            value={profileForm.entryYear}
                            onChange={(e) => setProfileForm(p => ({ ...p, entryYear: e.target.value }))}
                            className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-slate-250 text-sm outline-none transition-all appearance-none cursor-pointer"
                          >
                            {["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"].map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bio / Description</label>
                        <textarea
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                          placeholder="Write a brief intro about yourself..."
                          rows={4}
                          className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-slate-250 text-sm outline-none transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all"
                      >
                        Save Updated Changes
                      </button>

                    </form>
                  </div>
                </div>
              )}

              {/* SUBTAB: MESSAGES & CHATS */}
              {activeTab === "messages" && (
                <div className="grid md:grid-cols-3 gap-6 h-[72vh] md:h-[76vh]">
                  {/* Left Column: Active Chats List */}
                  <div className={`bg-slate-900/30 border border-slate-850 rounded-2xl flex flex-col overflow-hidden h-full animate-fadeIn ${selectedChatUser ? "hidden md:flex" : "flex"}`}>
                    <div className="p-4 border-b border-slate-850/60 shrink-0">
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Direct Messages</h2>
                      <p className="text-[10px] text-slate-500 mt-0.5">Your conversations</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {chatsLoading ? (
                        <div className="text-center py-8 text-xs text-slate-500">Loading chats...</div>
                      ) : myChats.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-500 italic px-4 leading-relaxed">No active conversations. Start chatting by clicking an avatar in the forum or a button on the marketplace!</div>
                      ) : (
                        myChats.map((chat) => {
                          const isSelected = selectedChatUser?._id === chat.user?._id;
                          return (
                            <div
                              key={chat.user?._id}
                              onClick={() => {
                                setSelectedChatUser(chat.user);
                                setActiveConversation([]);
                              }}
                              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                                isSelected
                                  ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400"
                                  : "bg-slate-950/20 border-transparent hover:bg-slate-900/40 text-slate-350"
                              }`}
                            >
                              <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 shrink-0 border border-slate-750">
                                {chat.user?.fullName ? chat.user.fullName[0].toUpperCase() : "S"}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-baseline">
                                  <p className="text-xs font-bold truncate text-slate-200">{chat.user?.fullName}</p>
                                  <span className="text-[8px] text-slate-500">
                                    {new Date(chat.lastMessageAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">{chat.lastMessage}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Column: Chat Conversation Thread */}
                  <div className={`md:col-span-2 bg-slate-900/30 border border-slate-850 rounded-2xl flex flex-col overflow-hidden h-full animate-fadeIn ${selectedChatUser ? "flex" : "hidden md:flex"}`}>
                    {selectedChatUser ? (
                      <>
                        {/* Thread Header */}
                        <div className="p-4 border-b border-slate-850/60 flex items-center justify-between shrink-0 bg-slate-950/10">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-indigo-650 flex items-center justify-center font-bold text-white shrink-0 shadow-inner">
                              {selectedChatUser.fullName ? selectedChatUser.fullName[0].toUpperCase() : "S"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-250">{selectedChatUser.fullName}</p>
                              <p className="text-[9px] text-slate-500 truncate">{selectedChatUser.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedChatUser(null)}
                            className="text-xs text-slate-500 hover:text-slate-350 px-2.5 py-1.5 rounded-lg hover:bg-slate-950 border border-transparent hover:border-slate-850 transition-colors"
                          >
                            Close Chat
                          </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                          {convLoading ? (
                            <div className="text-center py-12 text-xs text-slate-500">Opening conversation thread...</div>
                          ) : activeConversation.length === 0 ? (
                            <div className="text-center py-12 text-xs text-slate-650 italic">No messages sent yet. Send a message to start the thread.</div>
                          ) : (
                            activeConversation.map((msg) => {
                              const isMe = msg.sender === user?._id || msg.sender?._id === user?._id;
                              return (
                                <div
                                  key={msg._id}
                                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-md border ${
                                      isMe
                                        ? "bg-indigo-600/25 border-indigo-500/20 text-indigo-100 rounded-tr-none"
                                        : "bg-slate-950/60 border-slate-900 text-slate-300 rounded-tl-none"
                                    }`}
                                  >
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    <span className="block text-[8px] text-slate-500 text-right mt-1">
                                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Send Form */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-850/60 shrink-0 flex items-center gap-2 bg-slate-950/10">
                          <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder={`Send a direct message to ${selectedChatUser.fullName}...`}
                            className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-indigo-500/50 transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={!messageInput.trim()}
                            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 disabled:text-slate-500 text-white rounded-xl shadow-lg transition-colors shrink-0"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                        <Mail className="h-10 w-10 text-slate-700 mb-3" />
                        <p className="text-xs font-bold text-slate-400">No Chat Selected</p>
                        <p className="text-[10px] text-slate-600 mt-1 max-w-xs leading-relaxed">Select a contact from the list or contact a user from the Marketplace / Forum to start messaging.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* CREATE MODALS CONTAINER */}
      
      {/* 1. CLASS FORUM MODAL */}
      <AnimatePresence>
        {isFeedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative"
            >
              <button 
                onClick={() => setIsFeedModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-350 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-md font-bold text-white mb-4">Start Classroom Discussion</h3>
              <form onSubmit={handleCreateFeed} className="space-y-4">
                <div>
                  <textarea
                    rows={4}
                    value={feedInput.content}
                    onChange={(e) => setFeedInput({ content: e.target.value })}
                    placeholder="Ask a question, share campus updates, or post slides..."
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-200 text-xs outline-none resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98"
                >
                  Share to Class Feed
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. ROOMMATE MODAL */}
      <AnimatePresence>
        {isRoommateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative"
            >
              <button 
                onClick={() => setIsRoommateModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-350 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-md font-bold text-white mb-4">List Room / Find Roommate</h3>
              <form onSubmit={handleCreateRoommate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Preferred Gender</label>
                    <select
                      value={roommateInput.preferredGender}
                      onChange={(e) => setRoommateInput(p => ({ ...p, preferredGender: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none cursor-pointer"
                    >
                      <option value="Any">Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Budget (₦ / year)</label>
                    <input
                      type="number"
                      value={roommateInput.budget}
                      onChange={(e) => setRoommateInput(p => ({ ...p, budget: e.target.value }))}
                      placeholder="e.g. 150000"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Hostel Location</label>
                  <input
                    type="text"
                    value={roommateInput.location}
                    onChange={(e) => setRoommateInput(p => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Behind AAUA Gate, Akungba"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Description / Preferences</label>
                  <textarea
                    rows={3}
                    value={roommateInput.description}
                    onChange={(e) => setRoommateInput(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the room size, power supply, water availability, and preferred qualities in a roommate..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98"
                >
                  Publish Roommate Post
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. STUDY PARTNER MODAL */}
      <AnimatePresence>
        {isStudyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative"
            >
              <button 
                onClick={() => setIsStudyModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-350 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-md font-bold text-white mb-4">Request Study Partner</h3>
              <form onSubmit={handleCreateStudy} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Post Title</label>
                    <input
                      type="text"
                      value={studyInput.title}
                      onChange={(e) => setStudyInput(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. GST 111 Prep"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Course Code</label>
                    <input
                      type="text"
                      value={studyInput.course}
                      onChange={(e) => setStudyInput(p => ({ ...p, course: e.target.value }))}
                      placeholder="e.g. CSC 101"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                    <input
                      type="text"
                      value={studyInput.location}
                      onChange={(e) => setStudyInput(p => ({ ...p, location: e.target.value }))}
                      placeholder="e.g. Science LT"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Preferred Time</label>
                    <input
                      type="text"
                      value={studyInput.availability}
                      onChange={(e) => setStudyInput(p => ({ ...p, availability: e.target.value }))}
                      placeholder="e.g. Weekends, 4PM"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Details / Study Goals</label>
                  <textarea
                    rows={3}
                    value={studyInput.description}
                    onChange={(e) => setStudyInput(p => ({ ...p, description: e.target.value }))}
                    placeholder="What topics are you looking to review, and how many members do you want?"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98"
                >
                  Publish Study Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MARKETPLACE MODAL */}
      <AnimatePresence>
        {isMarketplaceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative"
            >
              <button 
                onClick={() => setIsMarketplaceModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-350 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-md font-bold text-white mb-4">Sell Item / List Service</h3>
              <form onSubmit={handleCreateMarketplace} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Item Name</label>
                    <input
                      type="text"
                      value={marketplaceInput.title}
                      onChange={(e) => setMarketplaceInput(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Calculus Textbook"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Price (₦)</label>
                    <input
                      type="number"
                      value={marketplaceInput.price}
                      onChange={(e) => setMarketplaceInput(p => ({ ...p, price: e.target.value }))}
                      placeholder="e.g. 5000"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={marketplaceInput.category}
                    onChange={(e) => setMarketplaceInput(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none cursor-pointer"
                  >
                    {["Textbook", "Electronics", "Fashion", "Hostel", "Service", "Other"].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">WhatsApp / Call Phone Number</label>
                  <input
                    type="text"
                    value={marketplaceInput.phoneNumber}
                    onChange={(e) => setMarketplaceInput(p => ({ ...p, phoneNumber: e.target.value }))}
                    placeholder="e.g. +2348012345678"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Description / Item Condition</label>
                  <textarea
                    rows={3}
                    value={marketplaceInput.description}
                    onChange={(e) => setMarketplaceInput(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe item condition, availability, etc."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-300 text-xs outline-none resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98"
                >
                  Publish Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MARKETPLACE DETAILS & SELLER PROFILE MODAL */}
      <AnimatePresence>
        {selectedMarketplaceItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 relative overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedMarketplaceItem(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-350 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* Product Header */}
              <div className="space-y-2 mb-6">
                <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-850 text-[10px] text-indigo-400 font-bold uppercase">
                  {selectedMarketplaceItem.category}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">{selectedMarketplaceItem.title}</h3>
                <p className="text-xl font-black text-emerald-450">₦{selectedMarketplaceItem.price.toLocaleString()}</p>
              </div>

              {/* Product Description */}
              <div className="bg-slate-950/50 border border-slate-850/60 rounded-xl p-4 mb-6">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Item Description</h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedMarketplaceItem.description}</p>
              </div>

              {/* Seller Academic Profile details */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seller Profile</h4>
                
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-md shrink-0">
                    {selectedMarketplaceItem.user?.fullName ? selectedMarketplaceItem.user.fullName[0].toUpperCase() : "S"}
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-200">{selectedMarketplaceItem.user?.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{selectedMarketplaceItem.user?.email}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400">
                        {selectedMarketplaceItem.user?.faculty || "AAUA"}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-400 font-semibold">
                        {selectedMarketplaceItem.user?.department || "Student"}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-semibold">
                        {selectedMarketplaceItem.user?.level || "Undergrad"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedMarketplaceItem.user?.bio && (
                  <div className="bg-slate-950/20 border border-slate-900 rounded-lg p-3">
                    <p className="text-xs italic text-slate-400">"{selectedMarketplaceItem.user.bio}"</p>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-col gap-3 mt-8 pt-4 border-t border-slate-800">
                {selectedMarketplaceItem.phoneNumber && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/${selectedMarketplaceItem.phoneNumber.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all text-center"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" /> Message on WhatsApp
                    </a>
                    <a
                      href={`tel:${selectedMarketplaceItem.phoneNumber}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all text-center"
                    >
                      Call Seller ({selectedMarketplaceItem.phoneNumber})
                    </a>
                  </div>
                )}
                
                {selectedMarketplaceItem.user?._id !== user?._id && (
                  <button
                    onClick={() => startDirectMessage(selectedMarketplaceItem.user)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all text-center"
                  >
                    <Mail className="h-4 w-4 shrink-0" /> Direct Message Seller
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;