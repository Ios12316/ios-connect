import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import studentRoutes from "./routes/studentRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import roommateRoutes from "./routes/roommateRoutes.js";
import studyPartnerRoutes from "./routes/studyPartnerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";




dotenv.config();

const app = express();

connectDB();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ["https://iosconnect.vercel.app", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}));

app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/roommates", roommateRoutes);
app.use("/api/study-partners", studyPartnerRoutes);
app.use("/api/notifications", notificationRoutes);


app.get("/", (req, res) => {
    res.send("IOS CONNECT API IS RUNNING!");
});


const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;