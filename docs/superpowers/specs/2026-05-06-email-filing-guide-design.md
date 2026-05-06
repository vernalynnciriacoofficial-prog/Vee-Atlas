# Email Filing Guide — Design Spec
**Date:** 2026-05-06
**For:** Principal Realtor's Executive Assistant
**Stack:** HTML + CSS only (no JavaScript, no frameworks)

---

## Purpose

A single-page visual reference web page that teaches an executive assistant how to:
1. File emails into the correct Gmail label/folder
2. Create and nest Gmail labels
3. Decide whether to file, archive, or create a new label

---

## Architecture

### Files
```
apps/email-guide/
├── index.html
└── style.css
```

Lives alongside `apps/decision-memo/` in the existing monorepo. Deployed to Vercel as a static site directly from the `apps/email-guide/` folder.

---

## Gmail Label Structure

### 1. CLIENTS
- Active Buyers
  - Searching
  - Offer Stage
- Active Sellers
  - Preparing to List
  - Listed
- Past Clients
- Prospects
  - Cold Leads
  - Warm Leads

### 2. TRANSACTIONS
- Under Contract
  - Buyer Side
  - Seller Side
- Closing Soon
- Closed
  - 2025
  - 2026

### 3. LISTINGS
- Active Listings
- Coming Soon
- Pending
- Expired / Withdrawn

### 4. FINANCE
- Commissions
- Invoices & Bills
- Expenses
- Earnest Money / Deposits

### 5. LEGAL & CONTRACTS
- Purchase Agreements
- Listing Agreements
- Disclosures
- Disputes

### 6. VENDORS & PARTNERS
- Title & Escrow
- Lenders / Mortgage
- Inspectors
- Contractors & Repairs
- Photographers & Stagers

### 7. TEAM & BROKERAGE
- Agents
- Admin / Support Staff
- Brokerage

### 8. LEADS & MARKETING
- Inbound Leads
  - Zillow
  - Website
  - Referrals
- Marketing Campaigns

### 9. PROFESSIONAL
- MLS Notifications
- Association / Board
- Continuing Education

### 10. ADMIN & OFFICE
- Scheduling
- Tech & Software

---

## Page Layout

Single scrollable page with a fixed navigation bar at the top.

### Fixed Nav Bar
- Left: "Inbox Filing Guide" brand label
- Right: 3 anchor links — `Folder Structure` | `Gmail How-To` | `File or Archive?`
- White background, subtle bottom shadow
- Note: Filing rules (email examples) are embedded inside the folder cards in Section 1, not a separate section

### Hero
- Page title: "Inbox Filing Guide"
- One-line subtitle: "Your reference for filing, labeling, and organizing Gmail"

### Section 1 — Folder Structure & Filing Rules
- 2-column card grid (single column on mobile)
- One card per folder category (10 total)
- Each card contains:
  - Color-coded badge with category name
  - Indented subfolder tree
  - Italic gray "Emails that go here" examples

### Section 2 — Gmail How-To
- Numbered steps with large colored step circles
- Bold action word per step (e.g., **Create**, **Move**, **Nest**, **Apply**)
- Plain description text below each action
- Covers: creating a label, nesting a sublabel, moving an email, applying multiple labels

### Section 3 — File or Archive?
- 3-column decision cards (single column on mobile):
  - **FILE IT** — soft green background
  - **ARCHIVE IT** — soft gray background
  - **NEW LABEL?** — soft yellow background
- Each card has bullet criteria + one concrete example

### Footer
- Small centered text: "Prepared for [Principal Realtor Name]'s Executive Assistant"

---

## Visual Style

| Element | Style |
|---|---|
| Background | White (`#ffffff`) |
| Body text | Dark charcoal (`#1a1a2e`) |
| Font | System font stack (no external fonts) |
| Nav bar | White, 1px bottom border, subtle shadow |
| Cards | White bg, 4px left colored border, light gray box shadow |
| Category colors | 10 distinct accent colors (blues, greens, oranges, purples) |
| How-To circles | Muted blue numbered circles |
| FILE card | Soft green (`#e8f5e9`) |
| ARCHIVE card | Soft gray (`#f5f5f5`) |
| NEW LABEL card | Soft yellow (`#fffde7`) |
| Mobile breakpoint | Single column below 768px |

---

## Folder Category Accent Colors

| # | Category | Color |
|---|---|---|
| 1 | Clients | `#1565c0` (deep blue) |
| 2 | Transactions | `#2e7d32` (deep green) |
| 3 | Listings | `#6a1b9a` (purple) |
| 4 | Finance | `#e65100` (deep orange) |
| 5 | Legal & Contracts | `#b71c1c` (deep red) |
| 6 | Vendors & Partners | `#00695c` (teal) |
| 7 | Team & Brokerage | `#455a64` (slate blue-gray) |
| 8 | Leads & Marketing | `#f57f17` (amber) |
| 9 | Professional | `#4527a0` (deep purple) |
| 10 | Admin & Office | `#37474f` (blue gray) |

---

## Filing Rules (Email Examples Per Category)

| Category | Example Emails That Belong Here |
|---|---|
| Clients / Active Buyers | Buyer inquiry replies, showing confirmations, offer feedback |
| Clients / Active Sellers | Seller updates, listing prep coordination, feedback from showings |
| Clients / Past Clients | Referral thank-yous, holiday check-ins, testimonial requests |
| Clients / Prospects | Cold inquiry responses, open house follow-ups |
| Transactions / Under Contract | Executed contracts, inspection scheduling, contingency notices |
| Transactions / Closing Soon | Final walkthrough confirmations, closing date reminders |
| Transactions / Closed | HUD statements, post-close thank-yous, commission confirmations |
| Listings | MLS confirmations, price change approvals, showing feedback |
| Finance | Commission statements, vendor invoices, expense receipts |
| Legal & Contracts | Signed agreements, disclosure receipts, legal notices |
| Vendors & Partners | Title company updates, lender pre-approvals, inspection reports |
| Team & Brokerage | Agent communications, staff scheduling, brokerage announcements |
| Leads & Marketing | Zillow lead alerts, website form submissions, campaign reports |
| Professional | MLS system emails, board/NAR newsletters, CE certificates |
| Admin & Office | Calendar invites, software renewal notices, office supply orders |

---

## Decision Guide: File, Archive, or New Label?

### FILE IT when:
- The email relates to an active client, deal, listing, or vendor
- You will need to find it again within the next 90 days
- It contains a signed document, confirmation, or important date
- Example: A lender sends a pre-approval letter for an active buyer

### ARCHIVE IT when:
- The email is informational only and no action is needed
- It's a newsletter, notification, or automated alert you've already read
- You're unlikely to search for it specifically again
- Example: A weekly MLS market report you've already reviewed

### CREATE A NEW LABEL when:
- Three or more emails of the same type don't fit any existing folder
- A new client, property address, or project is starting
- You and the principal have agreed a new category is needed
- Example: A major new commercial listing that warrants its own label under Listings

---

## Constraints
- No JavaScript
- No external fonts or icon libraries
- Must render correctly on Chrome, Safari, and Edge
- Must be mobile-responsive at 768px breakpoint
- Must deploy to Vercel as a static site with no build step
