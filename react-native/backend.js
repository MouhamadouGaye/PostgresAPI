const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const pool = new Pool();

async function createUser(email, password, username) {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
        "INSERT INTO users (email, username, password_hash, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *",
        [email, username, passwordHash, `https://avatars.dicebear.com/api/initials/${username}.svg`]
    );
    return result.rows[0];
}

// SignIn PAGE
const jwt = require("jsonwebtoken");

async function signIn(email, password) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ userId: user.id }, "your-secret-key", { expiresIn: "1h" });
    await pool.query("INSERT INTO sessions (user_id, token) VALUES ($1, $2)", [user.id, token]);
    return { token, user };
}
//Get Account
//Replace account.get with a query to fetch user data:


async function getAccount(userId) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    return result.rows[0];
}

//Get Current User
async function getCurrentUser(token) {
    const session = await pool.query("SELECT * FROM sessions WHERE token = $1", [token]);
    if (!session.rows[0]) throw new Error("Invalid session");
    return getAccount(session.rows[0].user_id);
}

//Sign Out
async function signOut(token) {
    await pool.query("DELETE FROM sessions WHERE token = $1", [token]);
}

// Instead of storage.createFile, integrate with S3 or similar:
// const AWS = require("aws-sdk");
// const s3 = new AWS.S3();
async function uploadFile(file) {
    const params = {
        Bucket: "your-bucket-name",
        Key: `uploads/${file.name}`,
        Body: file.content,
        ContentType: file.type
    };
    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location; // File URL
}


// Create Video Post
async function createVideoPost(form, userId) {
    const thumbnailUrl = await uploadFile(form.thumbnail);
    const videoUrl = await uploadFile(form.video);

    const result = await pool.query(
        "INSERT INTO videos (title, thumbnail_url, video_url, prompt, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [form.title, thumbnailUrl, videoUrl, form.prompt, userId]
    );
    return result.rows[0];
}
// Get All Posts
async function getAllPosts() {
    const result = await pool.query("SELECT * FROM videos ORDER BY created_at DESC");
    return result.rows;
}
// Get User Post
async function getUserPosts(userId) {
    const result = await pool.query("SELECT * FROM videos WHERE creator_id = $1", [userId]);
    return result.rows;
}


// Search Posts
async function searchPosts(query) {
    const result = await pool.query(
        "SELECT * FROM videos WHERE title ILIKE $1 ORDER BY created_at DESC",
        [`%${query}%`]
    );
    return result.rows;
}
// Get Latest Posts
async function getLatestPosts() {
    const result = await pool.query("SELECT * FROM videos ORDER BY created_at DESC LIMIT 7");
    return result.rows;
}
