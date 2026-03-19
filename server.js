const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const users = {}; // store data

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/auth/request-otp", (req, res) => {
  const { contact } = req.body;

  const otp = generateOTP();

  users[contact] = {
    otp,
    attempts: 0,
    expiry: Date.now() + 5 * 60 * 1000,
    blockedUntil: null
  };

  console.log(`OTP for ${contact}: ${otp}`);

  res.json({ message: "OTP sent (check console)" });
});

app.post("/auth/verify-otp", (req, res) => {
  const { contact, otp } = req.body;
  const user = users[contact];

  if (!user) return res.status(400).json({ error: "No OTP requested" });

  if (user.blockedUntil && Date.now() < user.blockedUntil) {
    return res.status(403).json({ error: "Blocked. Try later." });
  }

  if (Date.now() > user.expiry) {
    return res.status(400).json({ error: "OTP expired" });
  }

  if (user.otp === otp) {
    const token = uuidv4();
    user.token = token;
    return res.json({ token });
  } else {
    user.attempts++;

    if (user.attempts >= 3) {
      user.blockedUntil = Date.now() + 10 * 60 * 1000;
      return res.status(403).json({ error: "Blocked for 10 mins" });
    }

    return res.status(400).json({ error: "Invalid OTP" });
  }
});

app.get("/auth/me", (req, res) => {
  const token = req.headers.authorization;

  const user = Object.values(users).find(u => u.token === token);

  if (!user) return res.status(401).json({ error: "Unauthorized" });

  res.json({ message: "Welcome User!" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});