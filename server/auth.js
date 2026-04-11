const nodemailer = require("nodemailer");
const { getUserByEmail, createUser } = require("./db");

const otpStore = new Map();

// --- NEWLY ADDED: Modularized Auth Configuration and Routes ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

async function authRoutes(fastify, options) {
  fastify.post("/auth/send-otp", async (req, reply) => {
    const { email } = req.body;
    if (!email) return reply.code(400).send({ message: "Email required" });
    
    // Check DB for existing user metadata
    const existingUser = await getUserByEmail(email);
    console.log(`[AUTH] Sending OTP to ${email}. Discovered in DB? ${!!existingUser}`);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore.set(email, otp);
    
    try {
      await transporter.sendMail({
        from: '"Aurora Ecommerce" <ayush2001.in@gmail.com>',
        to: email,
        subject: "Your Personal Login OTP",
        html: `<h2>Welcome to Aurora!</h2><p>Your one-time password (OTP) is: <strong style="font-size:24px;">${otp}</strong></p><p>Please use this to log in.</p>`
      });
      return { message: "OTP sent successfully" };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ message: "Failed to securely send email SMTP" });
    }
  });

  fastify.post("/auth/verify-otp", async (req, reply) => {
    const { email, otp } = req.body;
    const storedOtp = otpStore.get(email);
    
    if (storedOtp && storedOtp === otp) {
      otpStore.delete(email); // Clear token
      
      // Upsert user natively in DB
      let user = await getUserByEmail(email);
      if (!user) {
         // Auto-provision admins dynamically based on string context if desired, or default to general user
         const role = email.includes("admin") ? "admin" : "user";
         user = await createUser(email, role);
      }

      return {
        message: "Login successful",
        token: "mock-jwt-" + Date.now(),
        user: { email: user.email, role: user.role }
      };
    }
    return reply.code(401).send({ message: "Invalid or expired OTP token" });
  });
}

module.exports = authRoutes;
