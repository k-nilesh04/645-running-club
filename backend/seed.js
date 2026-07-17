import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Member from "./models/Member.js";

dotenv.config();

const sampleMembers = [
  { name: "Nilesh Kumar", age: 19, runsCompleted: 42, distanceKm: 220, memberSince: 2026 },
  { name: "Rahul Sharma", age: 27, runsCompleted: 35, distanceKm: 190, memberSince: 2026 },
  { name: "Priya Verma", age: 24, runsCompleted: 30, distanceKm: 165, memberSince: 2026 },
  { name: "Ankit Singh", age: 31, runsCompleted: 28, distanceKm: 150, memberSince: 2025 },
  { name: "Sneha Gupta", age: 22, runsCompleted: 25, distanceKm: 132, memberSince: 2026 },
];

const seed = async () => {
  try {
    const connection = await connectDB();
    if (!connection) {
      console.error("Cannot seed without a valid MONGO_URI.");
      process.exit(1);
    }

    await Member.deleteMany();
    await Member.insertMany(sampleMembers);
    console.log("Sample members seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
