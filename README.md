**GetVouchify Web Platform**

The GetVouchify Website is the frontend interface of the GetVouchify digital trust platform — designed to help users send and receive verified recommendations (“vouches”) across categories. It enables structured data collection, analytics, and seamless communication between users and the GetVouchify team.

Overview

This repository contains the production-ready code deployed to getvouchify.com
.
It includes frontend components, integrations, and design logic implemented with Next.js, Tailwind CSS, and Resend API for email notifications.

Features
1. Domain & Deployment

Fully deployed on Vercel and configured with QServers DNS.

Supports both:

Root domain: https://getvouchify.com

Subdomain: https://www.getvouchify.com

Updated to Vercel’s latest DNS A and CNAME records for improved propagation and reliability.

2. Form Functionality

The main form captures user information with the following structured fields:

Full Name

Email Address

Location (Dropdown — prioritizing Lagos and Abuja)

Category (Dropdown — 5 defined categories)

Message / Description

The dropdown implementation replaces free-text inputs, enabling:

Accurate data categorization.

Easy analysis of user distribution by state and category.

3. Email Automation (Resend API Integration)

Integrated Resend Email API for automated email delivery.

On each form submission:

A notification is sent to hello@getvouchify.com
.

The submitter receives a confirmation email acknowledging receipt.

This ensures real-time communication and centralized tracking.

4. UI/UX Enhancements

Redesigned layout using Tailwind CSS for responsiveness and accessibility.

Added scrolling navigation bar for smoother page transitions.

Incorporated category-specific images and icons for visual identity.

Structured, minimalistic design emphasizing clarity, balance, and performance.

Technology Stack
Technology	Purpose
Next.js	Frontend framework
Tailwind CSS	Styling and layout
Resend API	Email automation
Vercel	Hosting and CI/CD
QServers	DNS and domain management
Environment Setup

To run the project locally, create a .env.local file and include:

RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_SITE_URL=https://getvouchify.com

Running Locally
# Clone repository
git clone https://github.com/<repo-link>.git

# Navigate into folder
cd getvouchify

# Install dependencies
npm install

# Start development server
npm run dev


Visit http://localhost:3000 in your browser.

Credentials

Vercel Account
Email: getvouchify@gmail.com

Password: Vouchify@2025

(Note: Provided for internal record purposes. Do not expose publicly.)
