# Email Filing Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page HTML/CSS visual guide teaching a Principal Realtor's executive assistant how to file Gmail emails into the correct label, create/nest Gmail labels, and decide when to file vs. archive.

**Architecture:** Two static files (`index.html` + `style.css`) in `apps/email-guide/`. No build step, no JavaScript, no external fonts or libraries. Deployed to Vercel as a static site by setting the root directory to `apps/email-guide/` in the Vercel project settings.

**Tech Stack:** HTML5, CSS3 (custom properties, CSS Grid, media queries)

---

## File Map

| File | Responsibility |
|---|---|
| `apps/email-guide/index.html` | All page markup — nav, hero, 3 sections, footer |
| `apps/email-guide/style.css` | All styles — variables, layout, cards, steps, decision cards, mobile |

---

## Task 1: Scaffold Project

**Files:**
- Create: `apps/email-guide/index.html`
- Create: `apps/email-guide/style.css`

- [ ] **Step 1: Create the two files**

Create `apps/email-guide/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inbox Filing Guide</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <nav class="nav">
    <span class="nav-brand">Inbox Filing Guide</span>
    <ul class="nav-links">
      <li><a href="#folder-structure">Folder Structure</a></li>
      <li><a href="#gmail-how-to">Gmail How-To</a></li>
      <li><a href="#file-or-archive">File or Archive?</a></li>
    </ul>
  </nav>

  <header class="hero">
    <h1>Inbox Filing Guide</h1>
    <p>Your reference for filing, labeling, and organizing Gmail</p>
  </header>

  <main>
    <section id="folder-structure" class="section">
      <div class="section__inner">
        <h2 class="section-title">Folder Structure</h2>
        <p class="section-desc">Each item below is a Gmail label. Subfolders are nested labels (e.g., <code>Clients/Active Buyers</code>). Emails that belong in each category are shown in italics.</p>
        <!-- Cards added in Task 2 -->
      </div>
    </section>

    <section id="gmail-how-to" class="section section--alt">
      <div class="section__inner">
        <h2 class="section-title">Gmail How-To</h2>
        <!-- Steps added in Task 3 -->
      </div>
    </section>

    <section id="file-or-archive" class="section">
      <div class="section__inner">
        <h2 class="section-title">File or Archive?</h2>
        <!-- Decision cards added in Task 4 -->
      </div>
    </section>
  </main>

  <footer class="footer">
    <p>Prepared for your Principal Realtor's inbox management</p>
  </footer>

</body>
</html>
```

Create `apps/email-guide/style.css` (empty for now):
```css
/* styles added in subsequent tasks */
```

- [ ] **Step 2: Open in browser and verify it loads**

Open `apps/email-guide/index.html` in Chrome. Expected: white page with plain unstyled text showing "Inbox Filing Guide", three nav links, and three section headings. No console errors.

- [ ] **Step 3: Commit**

```bash
git add apps/email-guide/index.html apps/email-guide/style.css
git commit -m "feat: scaffold email-guide app structure"
```

---

## Task 2: CSS Foundation — Variables, Reset, Nav, Hero

**Files:**
- Modify: `apps/email-guide/style.css`

- [ ] **Step 1: Add CSS variables, reset, nav, and hero styles**

Replace the contents of `apps/email-guide/style.css` with:
```css
/* === Variables === */
:root {
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --text: #1a1a2e;
  --text-muted: #6b7280;
  --bg: #ffffff;
  --bg-alt: #f9fafb;
  --border: #e5e7eb;
  --card-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  --radius: 8px;
  --step-color: #1565c0;
}

/* === Reset === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font); color: var(--text); background: var(--bg); line-height: 1.6; }
ul { list-style: none; }
a { color: inherit; text-decoration: none; }

/* === Nav === */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 60px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 100;
}

.nav-brand {
  font-weight: 700;
  font-size: 1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.2s;
}

.nav-links a:hover { color: var(--text); }

/* === Hero === */
.hero {
  margin-top: 60px;
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #f0f4ff 0%, #faf0ff 100%);
  border-bottom: 1px solid var(--border);
}

.hero h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.hero p {
  font-size: 1.125rem;
  color: var(--text-muted);
}

/* === Section layout === */
.section { padding: 4rem 0; }
.section--alt { background: var(--bg-alt); }
.section__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.section-desc {
  color: var(--text-muted);
  font-size: 0.9375rem;
  margin-bottom: 2rem;
}

.section-desc code {
  background: #f1f5f9;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-size: 0.85em;
}

/* === Footer === */
.footer {
  text-align: center;
  padding: 2rem;
  background: var(--bg-alt);
  border-top: 1px solid var(--border);
  font-size: 0.875rem;
  color: var(--text-muted);
}
```

- [ ] **Step 2: Open in browser and verify**

Refresh `apps/email-guide/index.html`. Expected:
- Fixed white nav bar with "Inbox Filing Guide" on left, three links on right
- Purple-blue gradient hero section with large bold title
- Three plain section blocks below
- Gray footer at bottom

- [ ] **Step 3: Commit**

```bash
git add apps/email-guide/style.css
git commit -m "feat: add CSS foundation, nav, and hero styles"
```

---

## Task 3: Folder Structure Section — HTML + CSS

**Files:**
- Modify: `apps/email-guide/index.html`
- Modify: `apps/email-guide/style.css`

- [ ] **Step 1: Replace the folder-structure section placeholder with the 10 category cards**

In `apps/email-guide/index.html`, replace the comment `<!-- Cards added in Task 2 -->` with:

```html
        <div class="card-grid">

          <div class="category-card card--clients">
            <div class="card-header">
              <span class="badge">1</span>
              <h3>Clients</h3>
            </div>
            <ul class="folder-tree">
              <li>Active Buyers
                <ul>
                  <li>Searching</li>
                  <li>Offer Stage</li>
                </ul>
              </li>
              <li>Active Sellers
                <ul>
                  <li>Preparing to List</li>
                  <li>Listed</li>
                </ul>
              </li>
              <li>Past Clients</li>
              <li>Prospects
                <ul>
                  <li>Cold Leads</li>
                  <li>Warm Leads</li>
                </ul>
              </li>
            </ul>
            <div class="email-examples">
              <p class="examples-label">Emails that go here:</p>
              <p class="examples-text">Buyer inquiry replies, showing confirmations, offer feedback, seller updates, referral thank-yous, open house follow-ups</p>
            </div>
          </div>

          <div class="category-card card--transactions">
            <div class="card-header">
              <span class="badge">2</span>
              <h3>Transactions</h3>
            </div>
            <ul class="folder-tree">
              <li>Under Contract
                <ul>
                  <li>Buyer Side</li>
                  <li>Seller Side</li>
                </ul>
              </li>
              <li>Closing Soon</li>
              <li>Closed
                <ul>
                  <li>2025</li>
                  <li>2026</li>
                </ul>
              </li>
            </ul>
            <div class="email-examples">
              <p class="examples-label">Emails that go here:</p>
              <p class="examples-text">Executed contracts, inspection scheduling, contingency notices, final walkthrough confirmations, HUD statements, post-close thank-yous</p>
            </div>
          </div>

          <div class="category-card card--listings">
            <div class="card-header">
              <span class="badge">3</span>
              <h3>Listings</h3>
            </div>
            <ul class="folder-tree">
              <li>Active Listings</li>
              <li>Coming Soon</li>
              <li>Pending</li>
              <li>Expired / Withdrawn</li>
            </ul>
            <div class="email-examples">
              <p class="examples-label">Emails that go here:</p>
              <p class="examples-text">MLS confirmations, price change approvals, showing feedback, status update requests, photography scheduling</p>
            </div>
          </div>

          <div class="category-card card--finance">
            <div class="card-header">
              <span class="badge">4</span>
              <h3>Finance</h3>
            </div>
            <ul class="folder-tree">
              <li>Commissions</li>
              <li>Invoices &amp; Bills</li>
              <li>Expenses</li>
              <li>Earnest Money / Deposits</li>
            </ul>
            <div class="email-examples">
              <p class="examples-label">Emails that go here:</p>
              <p class="examples-text">Commission statements, vendor invoices, expense receipts, earnest money wiring instructions, deposit confirmations</p>
            </div>
          </div>

          <div class="category-card card--legal">
            <div class="card-header">
              <span class="badge">5</span>
              <h3>Legal &amp; Contracts</h3>
            </div>
            <ul class="folder-tree">
              <li>Purchase Agreements</li>
              <li>Listing Agreements</li>
              <li>Disclosures</li>
              <li>Disputes</li>
            </ul>
            <div class="email-examples">
              <p class="examples-label">Emails that go here:</p>
              <p class="examples-text">Signed agreements, disclosure receipts, amendment requests, legal notices, dispute correspondence</p>
            </div>
          </div>

          <div class="category-card card--vendors">
            <div class="card-header">
              <span class="badge">6</span>
              <h3>Vendors &amp; Partners</h3>
            </div>
            <ul class="folder-tree">
              <li>Title &amp; Escrow</li>
              <li>Lenders / Mortgage</li>
              <li>Inspectors</li>
              <li>Contractors &amp; Repairs</li>
              <li>Photographers &amp; Stagers</li>
            </ul>
            <div class="email-examples">
              <p class="examples-label">Emails that go here:</p>
              <p class="examples-text">Title company updates, lender pre-approvals, inspection reports, contractor quotes, staging proposals</p>
            </div>
          </div>

          <div class="category-card card--team">
            <div class="card-header">
              <span class="badge">7</span>
              <h3>Team &amp; Brokerage</h3>
            </div>
            <ul class="folder-tree">
              <li>Agents</li>
              <li>Admin / Support Staff</li>
              <li>Brokerage</li>
            </ul>
            <div class="email-examples">
              <p class="examples-label">Emails that go here:</p>
              <p class="examples-text">Agent communications, staff scheduling, brokerage announcements, office policy updates, team meeting notes</p>
            </div>
          </div>

          <div class="category-card card--leads">
            <div class="card-header">
              <span class="badge">8</span>
              <h3>Leads &amp; Marketing</h3>
            </div>
            <ul class="folder-tree">
              <li>Inbound Leads
                <ul>
                  <li>Zillow</li>
                  <li>Website</li>
                  <li>Referrals</li>
                </ul>
              </li>
              <li>Marketing Campaigns</li>
            </ul>
            <div class="email-examples">
              <p class="examples-label">Emails that go here:</p>
              <p class="examples-text">Zillow lead alerts, website form submissions, referral introductions, campaign performance reports, ad account notifications</p>
            </div>
          </div>

          <div class="category-card card--professional">
            <div class="card-header">
              <span class="badge">9</span>
              <h3>Professional</h3>
            </div>
            <ul class="folder-tree">
              <li>MLS Notifications</li>
              <li>Association / Board</li>
              <li>Continuing Education</li>
            </ul>
            <div class="email-examples">
              <p class="examples-label">Emails that go here:</p>
              <p class="examples-text">MLS system emails, NAR/local board newsletters, CE certificates, licensing renewal notices, industry event invitations</p>
            </div>
          </div>

          <div class="category-card card--admin">
            <div class="card-header">
              <span class="badge">10</span>
              <h3>Admin &amp; Office</h3>
            </div>
            <ul class="folder-tree">
              <li>Scheduling</li>
              <li>Tech &amp; Software</li>
            </ul>
            <div class="email-examples">
              <p class="examples-label">Emails that go here:</p>
              <p class="examples-text">Calendar invites, software renewal notices, subscription billing, office supply orders, tech support tickets</p>
            </div>
          </div>

        </div>
```

- [ ] **Step 2: Add card styles to style.css**

Append to `apps/email-guide/style.css`:
```css
/* === Card Grid === */
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

/* === Category Cards === */
.category-card {
  background: var(--bg);
  border-radius: var(--radius);
  border-left: 4px solid var(--card-color, #ccc);
  box-shadow: var(--card-shadow);
  padding: 1.25rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--card-color, #ccc);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--card-color, #333);
}

.folder-tree { margin-bottom: 1rem; }

.folder-tree > li,
.folder-tree ul li {
  font-size: 0.8125rem;
  padding: 0.1rem 0;
  font-family: "SF Mono", "Consolas", "Courier New", monospace;
}

.folder-tree > li::before { content: "📁 "; }
.folder-tree ul { padding-left: 1.25rem; }
.folder-tree ul li::before { content: "└ "; }
.folder-tree ul ul { padding-left: 1rem; }
.folder-tree ul ul li::before { content: "  └ "; }

.email-examples {
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
}

.examples-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.examples-text {
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-style: italic;
}

/* Card accent colors */
.card--clients      { --card-color: #1565c0; }
.card--transactions { --card-color: #2e7d32; }
.card--listings     { --card-color: #6a1b9a; }
.card--finance      { --card-color: #e65100; }
.card--legal        { --card-color: #b71c1c; }
.card--vendors      { --card-color: #00695c; }
.card--team         { --card-color: #455a64; }
.card--leads        { --card-color: #f57f17; }
.card--professional { --card-color: #4527a0; }
.card--admin        { --card-color: #37474f; }
```

- [ ] **Step 3: Open in browser and verify**

Refresh the page. Expected:
- 2-column grid of 10 colored cards below the section heading
- Each card has a colored left border and matching colored number badge and title
- Subfolder tree visible inside each card
- Italic email examples at the bottom of each card

- [ ] **Step 4: Commit**

```bash
git add apps/email-guide/index.html apps/email-guide/style.css
git commit -m "feat: add folder structure section with 10 category cards"
```

---

## Task 4: Gmail How-To Section — HTML + CSS

**Files:**
- Modify: `apps/email-guide/index.html`
- Modify: `apps/email-guide/style.css`

- [ ] **Step 1: Replace the Gmail How-To placeholder with step content**

In `apps/email-guide/index.html`, replace the comment `<!-- Steps added in Task 3 -->` with:

```html
        <p class="section-desc">Step-by-step actions for managing labels in Gmail. Use these whenever you need to set up a new label, move an email, or tidy up the inbox.</p>
        <div class="steps">

          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3><strong>Create</strong> a top-level label</h3>
              <p>In Gmail's left sidebar, scroll to the bottom and click <strong>+ Create new label</strong>. Type the label name exactly as shown in the Folder Structure above (e.g., <code>Clients</code>). Click <strong>Create</strong>. The label will appear in the sidebar.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3><strong>Nest</strong> a sublabel under a parent</h3>
              <p>Click <strong>+ Create new label</strong> again. Type the sublabel name (e.g., <code>Active Buyers</code>). Check the box <strong>"Nest label under:"</strong> and select the parent label (e.g., <code>Clients</code>) from the dropdown. Click <strong>Create</strong>. It will appear as <code>Clients/Active Buyers</code> in the sidebar.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3><strong>Move</strong> an email to a label</h3>
              <p>Open the email. Click the <strong>folder/move icon</strong> in the toolbar (or click the three-dot <strong>More</strong> menu → <strong>Move to</strong>). Search for or select the label. The email moves out of Inbox and into that label. Alternatively, drag the email from the inbox list directly onto the label name in the left sidebar.</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3><strong>Apply</strong> multiple labels to one email</h3>
              <p>Some emails fit more than one category (e.g., a lender's pre-approval for an active buyer belongs in both <code>Clients/Active Buyers</code> and <code>Vendors &amp; Partners/Lenders</code>). Open the email, click the <strong>label icon</strong> (tag shape) in the toolbar, and check as many labels as apply. Click <strong>Apply</strong>. The email stays accessible from each label without being duplicated.</p>
            </div>
          </div>

        </div>
```

- [ ] **Step 2: Add step styles to style.css**

Append to `apps/email-guide/style.css`:
```css
/* === Steps (Gmail How-To) === */
.steps {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 0.5rem;
}

.step {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--step-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.step-content h3 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.375rem;
}

.step-content p {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.7;
}

.step-content code {
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  color: var(--text);
}
```

- [ ] **Step 3: Open in browser and verify**

Scroll to the Gmail How-To section. Expected:
- Gray background section
- 4 steps with blue numbered circles on the left
- Bold action word at start of each step title
- Gray description text with inline code snippets styled in light gray boxes

- [ ] **Step 4: Commit**

```bash
git add apps/email-guide/index.html apps/email-guide/style.css
git commit -m "feat: add Gmail How-To section with 4 labeled steps"
```

---

## Task 5: File or Archive? Section — HTML + CSS

**Files:**
- Modify: `apps/email-guide/index.html`
- Modify: `apps/email-guide/style.css`

- [ ] **Step 1: Replace the File or Archive? placeholder with decision cards**

In `apps/email-guide/index.html`, replace the comment `<!-- Decision cards added in Task 4 -->` with:

```html
        <p class="section-desc">Use this as a quick check whenever you're unsure what to do with an email.</p>
        <div class="decision-grid">

          <div class="decision-card decision-card--file">
            <h3>FILE IT</h3>
            <ul>
              <li>Related to an active client, deal, listing, or vendor</li>
              <li>You will need to find it again within the next 90 days</li>
              <li>Contains a signed document, confirmation, or important date</li>
              <li>The principal may ask about it</li>
            </ul>
            <p class="decision-example">Example: A lender sends a pre-approval letter for an active buyer → file under <strong>Vendors &amp; Partners / Lenders</strong> and apply <strong>Clients / Active Buyers</strong></p>
          </div>

          <div class="decision-card decision-card--archive">
            <h3>ARCHIVE IT</h3>
            <ul>
              <li>Informational only — no action needed</li>
              <li>A newsletter, notification, or automated alert you've already read</li>
              <li>You're unlikely to search for it specifically again</li>
              <li>Nothing to follow up on</li>
            </ul>
            <p class="decision-example">Example: A weekly MLS market report that has already been reviewed → archive it so it's searchable but out of the inbox</p>
          </div>

          <div class="decision-card decision-card--new">
            <h3>NEW LABEL?</h3>
            <ul>
              <li>Three or more emails of the same type don't fit any existing folder</li>
              <li>A new client, property address, or major project is starting</li>
              <li>Check with the principal before creating — keep the label list intentional</li>
            </ul>
            <p class="decision-example">Example: A major new commercial listing generates many emails → create a sublabel under <strong>Listings / Active Listings</strong> named after the property address</p>
          </div>

        </div>
```

- [ ] **Step 2: Add decision card styles to style.css**

Append to `apps/email-guide/style.css`:
```css
/* === Decision Cards (File or Archive?) === */
.decision-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.decision-card {
  border-radius: var(--radius);
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.decision-card--file    { background: #e8f5e9; }
.decision-card--archive { background: #f5f5f5; }
.decision-card--new     { background: #fffde7; }

.decision-card h3 {
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 1rem;
}

.decision-card--file    h3 { color: #1b5e20; }
.decision-card--archive h3 { color: #37474f; }
.decision-card--new     h3 { color: #e65100; }

.decision-card ul {
  list-style: disc;
  padding-left: 1.25rem;
  margin-bottom: 1rem;
}

.decision-card ul li {
  font-size: 0.875rem;
  margin-bottom: 0.375rem;
  line-height: 1.5;
}

.decision-example {
  font-size: 0.8125rem;
  font-style: italic;
  color: var(--text-muted);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 0.75rem;
  line-height: 1.6;
}
```

- [ ] **Step 3: Open in browser and verify**

Scroll to the File or Archive? section. Expected:
- 3-column grid: green card (FILE IT), gray card (ARCHIVE IT), yellow card (NEW LABEL?)
- Each card has an uppercase bold colored heading, bullet list, and italic example at bottom
- Cards are visually distinct from each other

- [ ] **Step 4: Commit**

```bash
git add apps/email-guide/index.html apps/email-guide/style.css
git commit -m "feat: add File or Archive decision section with 3 cards"
```

---

## Task 6: Mobile Responsiveness

**Files:**
- Modify: `apps/email-guide/style.css`

- [ ] **Step 1: Add mobile media queries**

Append to `apps/email-guide/style.css`:
```css
/* === Mobile (max 768px) === */
@media (max-width: 768px) {
  .nav { padding: 0 1rem; }
  .nav-brand { font-size: 0.875rem; }
  .nav-links { gap: 1rem; }
  .nav-links a { font-size: 0.75rem; }

  .hero { padding: 2.5rem 1.25rem; }
  .hero h1 { font-size: 1.5rem; }
  .hero p { font-size: 1rem; }

  .section__inner { padding: 0 1.25rem; }
  .section { padding: 2.5rem 0; }

  .card-grid { grid-template-columns: 1fr; }
  .decision-grid { grid-template-columns: 1fr; }

  .step-number { width: 32px; height: 32px; font-size: 0.875rem; }
}
```

- [ ] **Step 2: Verify mobile layout**

In Chrome, open DevTools (F12) → Toggle device toolbar → select iPhone 12 Pro (390px wide). Expected:
- Nav links remain readable (smaller font, tighter gap)
- Hero title wraps to two lines if needed
- Card grid collapses to single column
- Decision grid collapses to single column (stacked vertically)
- No horizontal scroll bar

- [ ] **Step 3: Commit**

```bash
git add apps/email-guide/style.css
git commit -m "feat: add mobile responsive styles at 768px breakpoint"
```

---

## Task 7: Deploy to Vercel

**Files:**
- No new files needed — Vercel is configured via dashboard

- [ ] **Step 1: Push all commits to GitHub**

```bash
git push origin main
```

Expected: All commits from Tasks 1–6 pushed successfully.

- [ ] **Step 2: Create a new Vercel project**

1. Go to vercel.com → Dashboard → **Add New Project**
2. Import the GitHub repository (Vee Atlas)
3. Under **Root Directory**, click **Edit** and set it to `apps/email-guide`
4. Framework Preset: **Other** (it's a static HTML site, no build step)
5. Build Command: leave empty
6. Output Directory: leave empty (or `.`)
7. Click **Deploy**

- [ ] **Step 3: Verify the live URL**

Once deployment completes, Vercel provides a URL (e.g., `email-guide-xxx.vercel.app`). Open it in Chrome and verify:
- Page loads correctly with nav, hero, all 3 sections, and footer
- Nav anchor links scroll to the correct sections
- Page looks identical to local file

- [ ] **Step 4: (Optional) Add a custom domain**

In Vercel project settings → Domains → add your custom domain if desired.

---

## Self-Review Checklist

**Spec coverage:**
- [x] Gmail label folder structure — 10 category cards with subfolders (Task 3)
- [x] Filing rules (email examples per category) — inside each card's italic examples row (Task 3)
- [x] Gmail how-to instructions — 4 numbered steps covering create/nest/move/apply (Task 4)
- [x] File vs. archive vs. new label decision guide — 3-card decision grid (Task 5)
- [x] Fixed nav bar with 3 anchor links (Task 1/2)
- [x] Hero header (Task 2)
- [x] Color-coded cards with distinct accent per category (Task 3)
- [x] Mobile responsive (Task 6)
- [x] Static HTML/CSS only, no JS, no external fonts (all tasks)
- [x] Deployed to Vercel (Task 7)

**Placeholder scan:** No TBDs or TODOs — all code is complete and runnable.

**Type consistency:** No functions or types — pure HTML/CSS, nothing to drift.
