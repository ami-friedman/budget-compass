# UI Planning — Design System + Accounts Flow (DSM)

## Scope
- Minimal **design system** (tokens + core components) needed to ship the Accounts feature.
- **Accounts flow** UX definition: screens, states, and interactions.
- **Money-specific validation + error patterns** for accounts.

## Practical Basics (MVP)
Use this as the **minimum set of decisions** to start implementation.

### MVP Tokens
- **Colors**: surface, text (primary/muted), primary action, destructive, positive/negative balance
- **Typography**: title, body, caption, numeric (for money)
- **Spacing**: xs/sm/md/lg
- **Radius**: card + input

### MVP Components
- App shell + page header
- Account list (cards or rows)
- Primary button
- Modal (add/edit)
- Text input, select, money input
- Inline error + form error banner
- Empty state

### MVP Flow (Accounts)
- Accounts list → Add account modal → Create
- Accounts list → Edit account modal → Save
- Accounts list → Delete confirmation → Delete

### MVP Validation
- Required name
- Valid currency amount (2 decimals)
- Negative balances allowed but visually marked

## Design System — Tokens

### Color (semantic)
- **Surface**: app background, cards, elevated panels
- **Text**: primary, secondary, muted
- **Interactive**: primary action, secondary action, destructive
- **Status**: success, warning, error, info
- **Money**:
  - Positive balance (income/credit)
  - Negative balance (debt/credit card)
  - Neutral balance (zero)

### Typography
- **Display**: page titles
- **Body**: default text
- **Caption/Meta**: helper text, timestamps
- **Numeric**: balances and amounts (tabular/monospace optional)

### Spacing & Layout
- **Spacing scale**: xs, sm, md, lg, xl
- **Container width**: readable content column
- **Grid**: responsive columns for account cards

### Shape & Elevation
- **Radius**: card, button, input
- **Elevation**: base, hover, modal

### Motion
- **Fast**: hover/press states
- **Standard**: modal open/close, list updates
- Avoid motion in money values that could imply change not confirmed

### Data Formatting
- **Currency**: locale-aware, always show currency symbol
- **Negative**: explicit minus sign and color cue
- **Zero**: neutral color, avoid ambiguity

## Design System — Core Components

### App Shell
- Global navigation
- Page container with title + primary actions
- Content area with consistent padding

### Navigation
- Primary navigation items: Dashboard, Accounts, Categories, Budget, Transactions
- Current section highlight + icon + label

### Page Header
- Title, short description
- Primary action button (e.g., “Add Account”)
- Optional secondary action(s)

### Account Card / List Row
- Name
- Account type (e.g., Cash/Monthly/Savings)
- Balance (formatted money)
- Optional bank/institution name
- Context menu (edit, delete)

### Money Display
- Balance label + value
- Positive/negative/zero styles
- Optional “Updated at” meta

### Forms
- Text input (name)
- Select (account type)
- Money input (balance)
- Helper text + inline validation

### Modal / Drawer
- Title, form fields, primary + secondary actions
- Escape + close icon

### Buttons
- Primary, secondary, ghost, destructive
- Loading + disabled states

### Empty State
- Clear message
- Call-to-action to create first account

### Errors & Alerts
- Inline field errors
- Form-level errors
- Toast for non-blocking alerts

### Confirmation
- Destructive confirmation (delete)
- Clear consequences + irreversible note

### Skeletons
- Loading placeholders for list/cards

## Accounts Feature — UI Flow

### Entry Points
- Global nav → Accounts
- Post-onboarding CTA → “Add your first account”

### Screen: Accounts List
**Purpose:** overview of physical money containers.

**Content:**
- Page header with “Add Account” CTA
- Account cards/grid or list
- Balance emphasis and account type label

**States:**
- Loading: skeleton cards
- Empty: illustration + “Create first account”
- Error: retry + error summary

**Actions:**
- Add Account (primary)
- Context menu: Edit, Delete

### Screen: Add Account (Modal)
**Fields:**
- Name (required)
- Type (Cash/Monthly/Savings)
- Starting balance (required, money input)

**Actions:**
- Create (primary)
- Cancel (secondary)

**Validation:**
- Required fields
- Balance must be valid currency number
- Prevent duplicate names within user’s accounts (soft warning + allow override)

### Screen: Edit Account (Modal)
**Fields:** same as Add, prefilled

**Actions:**
- Save (primary)
- Cancel (secondary)

**Rules:**
- Editing balance changes only if user explicitly edits; do not auto-normalize

### Screen: Delete Account (Confirmation)
**Prompt:** “Delete account?”
- Show account name and current balance
- Explain impact: “Transactions linked to this account will remain, but may show ‘unknown account’ until reassigned.”

**Actions:**
- Delete (destructive)
- Cancel

## Money-Specific Error + Validation Patterns

### Amount Input
- Reject non-numeric characters (except decimal separator)
- Show inline error: “Enter a valid amount”
- Normalize to 2 decimal places on blur

### Balance Semantics
- If negative balance, show a small badge: “Debt”
- Do not auto-convert sign when account type changes

### Form Errors
- Field-level errors placed under the field
- Form-level error banner for API/network failures
- Never show raw backend error messages

### Conflict/Integrity Errors
- Duplicate account name: soft warning with “Use anyway” option
- Deleting account with linked transactions: confirmation must mention impact

## Accessibility Notes
- All actions reachable via keyboard
- Focus trap in modals
- Button labels must be explicit (no icon-only without aria labels)
