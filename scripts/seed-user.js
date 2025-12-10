const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'staff' },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema, 'codex_users');

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const username = process.env.ADMIN_USER;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !password) {
            console.error("Error: ADMIN_USER and ADMIN_PASSWORD env vars must be set to run this script safely.");
            process.exit(1);
        }

        await User.deleteMany({ username });
        const passwordHash = await bcrypt.hash(password, 12);
        await User.create({ username, passwordHash, role: 'admin' });

        console.log(`Admin user '${username}' updated/created successfully.`);

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
