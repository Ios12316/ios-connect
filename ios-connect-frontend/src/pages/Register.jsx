import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as motionFramer, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  GraduationCap, 
  School, 
  BookOpen, 
  Building, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Camera,
  UploadCloud
} from "lucide-react";
import API from "../services/axios";
import { AuthContext } from "../context/Context";
import { toast } from "../store/notificationStore";
import Navbar from "../components/Navbar";

// Lists of faculties and departments at AAUA for dynamic dropdowns
const facultyDepartments = {
  "Faculty of Agriculture": [
    "Agricultural Economics",
    "Agricultural Extension and Rural Development",
    "Agronomy",
    "Animal Science",
    "Fisheries and Aquaculture",
    "Forestry and Wildlife Management",
    "Food Science and Technology"
  ],
  "Faculty of Arts": [
    "English Studies",
    "History and International Studies",
    "Performing Arts",
    "Yoruba",
    "Linguistics",
    "Linguistics/Yoruba",
    "Philosophy",
    "Religion and African Culture",
    "French"
  ],
  "Faculty of Education": [
    "Adult Education",
    "English Education",
    "History Education",
    "Religious Education",
    "Yoruba Education",
    "Biology Education",
    "Chemistry Education",
    "Computer Science Education",
    "Integrated Science Education",
    "Mathematics Education",
    "Physics Education",
    "Health Education",
    "Human Kinetics Education",
    "Technical Education",
    "Guidance and Counseling",
    "Early Childhood Education",
    "Educational Management",
    "Geography Education",
    "Political Science Education",
    "Economics Education",
    "Social Studies Education",
    "Library and Information Studies"
  ],
  "Faculty of Environmental Design and Management": [
    "Architecture",
    "Estate Management",
    "Surveying and Geoinformatics",
    "Urban and Regional Planning"
  ],
  "Faculty of Law": [
    "Law"
  ],
  "Faculty of Science": [
    "Biochemistry",
    "Chemistry",
    "Industrial Chemistry",
    "Animal and Environmental Biology",
    "Mathematics",
    "Industrial Mathematics",
    "Geology",
    "Applied Geophysics",
    "Microbiology",
    "Physics and Electronics",
    "Plant Science and Biotechnology"
  ],
  "Faculty of Social Sciences": [
    "Criminology and Security Studies",
    "Economics",
    "Geography and Planning Sciences",
    "Mass Communication",
    "Political Science",
    "Pure and Applied Psychology",
    "Sociology"
  ],
  "Faculty of Administration and Management Sciences": [
    "Accounting",
    "Banking and Finance",
    "Business Administration",
    "Public Administration"
  ],
  "Faculty of Allied Health Sciences": [
    "Medical Laboratory Science",
    "Public Health",
    "Nursing Science"
  ],
  "Faculty of Computing": [
    "Computer Science",
    "Information and Communication Technology (ICT)",
    "Software Engineering",
    "Cyber Security",
    "Data Science and Artificial Intelligence",
    "Information Systems"
  ]
};

const levels = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"];
const entryYears = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // Form steps state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = back
  const [loading, setLoading] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    school: "Adekunle Ajasin University, Akungba-Akoko (AAUA)",
    gender: "",
    faculty: "",
    department: "",
    level: "",
    entryYear: ""
    // profilePicture: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Reset department if faculty changes
      if (name === "faculty") {
        updated.department = "";
      }
      return updated;
    });
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  /*
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, profilePicture: "" }));
  };
  */

  // Step Validations
  const isStep1Valid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.email.includes("@") &&
      formData.password.length >= 6
    );
  };

  const isStep2Valid = () => {
    return (
      formData.school.trim() !== "" &&
      formData.gender !== ""
    );
  };

  const isStep3Valid = () => {
    return (
      formData.faculty !== "" &&
      formData.department !== "" &&
      formData.level !== "" &&
      formData.entryYear !== ""
    );
  };

  const nextStep = () => {
    if (step === 1 && !isStep1Valid()) {
      toast.error("Please fill in all fields correctly (Password min 6 chars)");
      return;
    }
    if (step === 2 && !isStep2Valid()) {
      toast.error("Please select your gender");
      return;
    }
    setDirection(1);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    /*
    if (!formData.profilePicture) {
      toast.error("Please upload a profile photo to complete registration");
      return;
    }
    */
    setLoading(true);
    try {
      // Map school name to "AAUA" to match default or validate backend expectation
      const payload = {
        ...formData,
        school: "AAUA" // standard format stored in backend database
        // profilePicture: formData.profilePicture
      };

      const response = await API.post("/users/register", payload);
      toast.success(response.data.message || "Registration Successful!");
      
      // Save user and token to state
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
      const errorMsg = error.response?.data?.message || "Something went wrong during registration.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Animation configurations
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" }
    })
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center pt-28 pb-12 px-6 relative overflow-hidden">
      
      <Navbar />

      {/* Background radial glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl mt-6">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Create Student Account</h2>
          <p className="text-slate-400 text-sm mt-2">Connect with classmates, match roommates, and trade resources</p>
        </div>

        {/* Form Box */}
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative">
          
          {/* Form Progress Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/60 overflow-x-auto gap-2 scrollbar-none">
            {[1, 2, 3 /*, 4 */].map((s) => (
              <div key={s} className="flex items-center gap-2 shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === s 
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/35 ring-4 ring-indigo-500/20" 
                    : step > s 
                      ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40" 
                      : "bg-slate-950 border border-slate-800 text-slate-500"
                }`}>
                  {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                </div>
                <span className={`text-xs font-semibold ${step === s ? "text-indigo-400" : "text-slate-500"}`}>
                  {s === 1 ? "Account" : s === 2 ? "Profile" : "Academic" /* : "Photo" */}
                </span>
                {s < 3 /* 4 */ && <div className="h-px w-6 sm:w-10 bg-slate-850" />}
              </div>
            ))}
          </div>

          <form onSubmit={(e) => handleSubmit(e, false)}>
            <AnimatePresence mode="wait" custom={direction}>
              
              {/* STEP 1: Account Credentials */}
              {step === 1 && (
                <motionFramer.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-slate-250 text-sm placeholder-slate-600 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                    <span className="text-[10px] text-slate-500 mt-1.5 block">Use your university/standard student email address.</span>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/80 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-slate-250 text-sm placeholder-slate-600 transition-all outline-none"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1.5 block">Must be at least 6 characters long.</span>
                  </div>
                </motionFramer.div>
              )}

              {/* STEP 2: Demographics */}
              {step === 2 && (
                <motionFramer.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* School Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      School / University
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <School className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        name="school"
                        value={formData.school}
                        disabled
                        className="w-full bg-slate-950/40 border border-slate-900 text-slate-500 rounded-xl py-3 pl-11 pr-4 text-sm cursor-not-allowed transition-all outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-indigo-400 mt-1.5 block flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Enabled exclusively for AAUA community members.
                    </span>
                  </div>

                  {/* Gender selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Gender
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {["Male", "Female"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => handleGenderSelect(g)}
                          className={`py-3.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                            formData.gender === g 
                              ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5" 
                              : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-305"
                          }`}
                        >
                          <span className={`h-2.5 w-2.5 rounded-full ${formData.gender === g ? "bg-indigo-400" : "bg-slate-700"}`} />
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </motionFramer.div>
              )}

              {/* STEP 3: Academic Details */}
              {step === 3 && (
                <motionFramer.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Faculty selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Faculty
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Building className="h-5 w-5" />
                      </div>
                      <select
                        name="faculty"
                        value={formData.faculty}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-slate-250 text-sm outline-none transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" className="text-slate-600">Select Faculty</option>
                        {Object.keys(facultyDepartments).map((fac) => (
                          <option key={fac} value={fac} className="bg-slate-950 text-slate-300">{fac}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Department selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Department
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        disabled={!formData.faculty}
                        className={`w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-slate-250 text-sm outline-none transition-all appearance-none cursor-pointer ${
                          !formData.faculty ? "opacity-50 cursor-not-allowed bg-slate-950/40" : ""
                        }`}
                        required
                      >
                        <option value="" className="text-slate-600">
                          {!formData.faculty ? "Select Faculty First" : "Select Department"}
                        </option>
                        {formData.faculty && facultyDepartments[formData.faculty]?.map((dept) => (
                          <option key={dept} value={dept} className="bg-slate-950 text-slate-300">{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Level and Entry Year row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Level */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Level
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-slate-250 text-sm outline-none transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" className="text-slate-600">Select Level</option>
                        {levels.map((lvl) => (
                          <option key={lvl} value={lvl} className="bg-slate-950 text-slate-300">{lvl}</option>
                        ))}
                      </select>
                    </div>

                    {/* Entry Year */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Entry Year
                      </label>
                      <div className="relative">
                        <select
                          name="entryYear"
                          value={formData.entryYear}
                          onChange={handleChange}
                          className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-slate-250 text-sm outline-none transition-all appearance-none cursor-pointer"
                          required
                        >
                          <option value="" className="text-slate-600">Select Year</option>
                          {entryYears.map((yr) => (
                            <option key={yr} value={yr} className="bg-slate-950 text-slate-300">{yr}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </motionFramer.div>
              )}

              {/* STEP 4: Profile Picture Upload (New - Commented out until Cloudinary is ready) */}
              {/*
              {step === 4 && (
                <motionFramer.div
                  key="step4"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col items-center justify-center space-y-6"
                >
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 text-center w-full">
                    Upload Profile Photo
                  </label>

                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-dashed border-slate-800 bg-slate-950/80 flex items-center justify-center relative transition-all group-hover:border-indigo-500">
                      {formData.profilePicture ? (
                        <img 
                          src={formData.profilePicture} 
                          alt="Profile Preview" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Camera className="h-10 w-10 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                      )}
                    </div>

                    <input 
                      type="file" 
                      id="profilePictureInput" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <label 
                      htmlFor="profilePictureInput"
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-500 text-white shadow-lg cursor-pointer hover:bg-indigo-600 transition-all active:scale-95"
                    >
                      <UploadCloud className="h-4 w-4" />
                    </label>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-400">Choose a clean profile picture so colleagues can recognize you.</p>
                    <p className="text-[10px] text-slate-600 mt-1">Accepts JPG, PNG. Max size 2MB.</p>
                  </div>

                  {formData.profilePicture && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-350 transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </motionFramer.div>
              )}
              */}

            </AnimatePresence>

            {/* Form Actions Footer */}
            <div className="flex gap-4 mt-10 pt-6 border-t border-slate-800/60">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-350"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-350 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Register Account
                      <CheckCircle className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>

          </form>

        </div>

        {/* Existing account link */}
        <div className="text-center mt-6 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Sign In
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Register;