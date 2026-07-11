# Template Canvas App

A powerful template and canvas editor application built with React, Vite, TailwindCSS, and Node.js (Express).

## Features
- **Canvas Editor**: Drag and drop, resize, rotate, and style text, images, and shapes.
- **Bulk Generation**: Admins can upload a CSV/Excel file to bulk generate certificates/documents.
- **PDF Export**: High fidelity, retina-ready PDF exports using `html2canvas` and `jsPDF`.
- **Authentication**: Seamless authentication with Clerk.
- **Payment Integration**: Razorpay for Pro upgrades.
- **Node.js Backend**: Express API for templates, designs, payments, and PDF processing.

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (`.env`):
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret
   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Production & Hosting on Render.com

This project is fully configured to be hosted on Render as a single web service. 

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm run start
```

### Environment Variables for Production
Make sure to add the same `.env` variables to your Render Web Service configuration.

**Note on Database:**
This project currently uses a local JSON file-based database (`data/*.json`). On Render, the local disk is ephemeral and resets on each deployment. For a persistent database, attach a Render Background Disk to your web service and set a `DB_DIR` environment variable pointing to the disk mount path (e.g., `/var/data`).
