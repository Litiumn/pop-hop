# Pop Hop: Technical Information for SRS

This document provides a comprehensive technical and functional overview of the **Pop Hop** platform. It is designed to be used as input for an AI to generate a Software Requirements Specification (SRS).

---

## 1. Product Overview
**Pop Hop** is a digital flea market management platform specifically built for the community in **Angeles City, Pampanga**. It bridges the gap between event organizers and vendors, streamlining the application, payment, and booth assignment processes.

---

## 2. Target Audience
- **Organizers:** Individuals or groups who manage flea market events.
- **Vendors:** Local sellers (Thrift, Food, Handmade, etc.) looking for market opportunities.

---

## 3. Technology Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS + Vanilla CSS (Dynamic Variables)
- **Icons:** Lucide React
- **Authentication:** Custom JWT-based authentication with role-based access control (RBAC).

---

## 4. User Roles & Permissions

### A. Vendor
- **Onboarding:** Create a vendor profile with shop name, logo, categories, and social links.
- **Event Discovery:** Browse a live feed of "Published" flea market events.
- **Applications:** Apply to events and track status (Pending, Approved, Rejected).
- **Payments:** Upload payment confirmation (e.g., GCash screenshots) directly to the application.
- **Booth Management:** View assigned booth numbers and their locations on a live map.
- **Feedback:** View public ratings and feedback provided by organizers after events.

### B. Organizer
- **Event Management:** Create events with details (Date, Price, Booth Limit, Description).
- **Workflow Control:** Toggle event status between **Draft**, **Published**, and **Closed**.
- **Application Review:** Approve or reject vendor applications based on their profiles.
- **Payment Verification:** Review and verify vendor payment proofs.
- **Booth Assignment:** Use an **Interactive Drag-and-Drop Grid** to assign approved vendors to specific stalls.
- **Collaboration:** Invite other registered organizers via email to co-manage specific events.
- **Announcements:** Broadcast real-time announcements to all vendors applied to a specific event.
- **Feedback Loop:** Provide public ratings and text-based feedback for vendors.

---

## 5. Key Functional Requirements

### 1. Interactive Booth Grid
- **Drag-and-Drop:** Organizers can drag approved vendors from a sidebar and drop them onto a visual grid representing the market layout.
- **Live Sync:** Changes are saved to the database and immediately visible to the assigned vendors.

### 2. Public Vendor Rating System
- **Public Accountability:** Organizer feedback for vendors is public, helping build a trusted community of reliable sellers.
- **Transparency:** Vendors can see their rating history on their dashboard.

### 3. Multi-Organizer Collaboration
- **Shared Access:** Events can have multiple "Collaborators" who have full management rights.
- **Invitation System:** Email-based invitation system for adding co-organizers.

### 4. Responsive UI/UX
- **Mobile-First:** Optimized for mobile use (hamburger menus, bottom sheets for event details).
- **Desktop Optimized:** Responsive grid layouts (CSS Grid) that utilize full screen width on larger monitors.
- **Accessibility:** Uses a soft black (`#3d3d3d`) instead of pure black to reduce eye strain.

---

## 6. System Architecture
- **API Layer:** Next.js Route Handlers (Server-side) protected by middleware.
- **State Management:** React `useState` and `useEffect` with direct API polling for real-time-like updates.
- **Data Model:** 
    - `User`: Handles authentication and roles.
    - `Event`: Core entity for flea market details.
    - `Application`: Link between User and Event, carrying status and payment data.
    - `Booth`: Represents physical space in an event.
    - `Announcement`: Broadcast messages for event participants.
