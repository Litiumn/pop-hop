# Pop Hop – Flea Market Platform

**Pop Hop** is a comprehensive management platform designed to connect flea market organizers and vendors in **Angeles City, Pampanga**. Built with a modern tech stack and a vibrant "Y2K Pop-Art" aesthetic, it streamlines the chaos of organizing physical markets into a seamless digital experience.

---

## 🚀 Key Features

### For Organizers
- **Event Command Center:** Create and manage events with status toggles (Draft/Published/Closed).
- **Interactive Booth Assignment:** High-fidelity **Drag-and-Drop** grid for assigning vendors to stalls.
- **Multi-Organizer Support:** Collaborate with other organizers by inviting them to manage your events.
- **Payment Verification:** Review and approve vendor payment proofs in real-time.
- **Broadcast System:** Send announcements directly to all event participants.

### For Vendors
- **Event Discovery:** Browse and apply for upcoming flea markets in the city.
- **Digital Storefront:** Manage your vendor profile, shop categories, and social links.
- **Live Status Tracking:** Real-time updates on application approval and booth assignments.
- **Feedback System:** View public ratings and feedback from organizers to build your reputation.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Lucide Icons.
- **Backend:** Next.js API Routes (Route Handlers).
- **Database:** PostgreSQL with Prisma ORM.
- **Auth:** Custom JWT-based Role-Based Access Control.
- **Design:** Custom "Soft-Black" UI system for reduced eyestrain and high accessibility.

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database instance

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/raldddddddd/pop-hop.git

# Install dependencies
npm install

# Set up your environment variables (.env)
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_secret_key"

# Initialize the database
npx prisma db push
```

### 3. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the platform.

---

## 📄 Documentation
- For a deep dive into the technical requirements, see [Information.md](./Information.md).
- User guides are available in the app under `/how-it-works`.

---

## 🤝 Built For the Community
Pop Hop is built to empower local small businesses and event creators in Pampanga. 🤙
