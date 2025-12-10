const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
const envPath = path.resolve(__dirname, '../.env.local');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("Error loading .env.local:", result.error);
}

const MONGODB_URI = process.env.MONGODB_URI;

console.log("----------------------------------------");
console.log("Diagnostic DB Connection Test");
console.log("----------------------------------------");
console.log("Loading env from:", envPath);
console.log("URI found:", MONGODB_URI ? "YES" : "NO");
if (MONGODB_URI) {
    // Mask password for display
    const masked = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    console.log("Connecting to:", masked);
}
console.log("----------------------------------------");

async function test() {
    try {
        if (!MONGODB_URI) throw new Error("No URI");

        console.log("Attempting mongoose.connect...");
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("✅ SUCCESS: Connected to MongoDB!");

        console.log("Checking database name...");
        console.log("Connected to DB:", mongoose.connection.name);

        await mongoose.disconnect();
        console.log("Disconnected.");
    } catch (e) {
        console.error("❌ CONNECTION FAILED");
        console.error("Error Name:", e.name);
        console.error("Error Message:", e.message);
        if (e.codeName) console.error("CodeName:", e.codeName);
        if (e.code) console.error("Code:", e.code);
    }
}

test();
