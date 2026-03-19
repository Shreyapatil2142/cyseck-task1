# OTP-Based Authentication Web Application

## 📌 Overview

This project is a minimal full-stack web application that implements OTP (One-Time Password) based authentication. It allows users to log in using their email or phone number and verifies identity through an OTP mechanism.

---

## 🏗️ Architecture

* **Frontend**: React.js
* **Backend**: Node.js with Express
* **Storage**: In-memory (JavaScript object)

The frontend communicates with the backend via REST APIs. The backend handles OTP generation, validation, and session management.

---

## 🔑 Core Features

* User enters email/phone number
* OTP is generated and sent (mocked via console)
* User verifies OTP
* Successful login redirects to Welcome page
* Maximum 3 invalid attempts allowed
* User is blocked for 10 minutes after 3 failed attempts

---

## ⚙️ API Endpoints

### 1. Request OTP

**POST /auth/request-otp**

* Input: `{ contact }`
* Generates OTP and stores it with expiry
* OTP is logged in the server console

---

### 2. Verify OTP

**POST /auth/verify-otp**

* Input: `{ contact, otp }`
* Validates OTP
* Returns a session token on success
* Blocks user after 3 failed attempts

---

### 3. Get User Info

**GET /auth/me**

* Header: `Authorization: token`
* Returns user info if token is valid

---

## 🔐 OTP Strategy

* OTP is a randomly generated 6-digit number
* Stored along with:

  * Expiry time (5 minutes)
  * Attempt count
  * Block status
* Max 3 attempts allowed
* After 3 failed attempts → blocked for 10 minutes

---

## 💡 Assumptions

* OTP expires in **5 minutes**
* Users are **auto-created** (no prior registration required)
* Session token is a **random UUID string**
* OTP delivery is **mocked via console output**
* No database used (in-memory storage)
* Rate limiting not implemented (basic blocking used instead)

---

## 🎨 Frontend Pages

1. **Login Page**

   * Input for email/phone
   * Sends OTP request

2. **OTP Verification Page**

   * Input for OTP
   * Verifies OTP with backend

3. **Welcome Page**

   * Displayed after successful login
   * Fetches user data using token

---

## 🧪 Validations

* Input field cannot be empty
* OTP must be 6 digits
* Token stored in localStorage
* Session persists across page refresh

---

## 🚀 How to Run the Project

### Backend

```bash
npm install
node server.js
```

### Frontend

```bash
npm install
npm start
```

---

## 📂 Project Structure

```
otp-auth/
│── server.js
│── package.json
│
└── client/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── App.js
```

---

## 🎯 Key Focus Areas

* Clean and minimal API design
* Handling edge cases (expiry, blocking)
* Simple and functional UI
* Clear separation of frontend and backend

---

## 📌 Notes

This implementation focuses on simplicity and clarity rather than production-level security. In a real-world scenario, improvements like database storage, encryption, rate limiting, and proper OTP delivery services would be required.

---

## ✅ Conclusion

This project demonstrates a basic OTP authentication flow with backend validation, frontend integration, and session handling while maintaining simplicity and readability.


## 👩‍💻 Author

- [@shreyapatil2142](https://github.com/Shreyapatil2142)
