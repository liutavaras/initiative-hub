# ExecHub - Executive Initiative Management Portal

## Requirements Document

---

## 1. Application Overview

**ExecHub** is a corporate initiative management portal designed for executive-level intake, review, and approval of major organizational initiatives. The platform provides a polished, professional interface using a "gravitas" color palette (Deep Navy and Gold) to support senior leadership in tracking and managing strategic projects.

### Key Capabilities
- Multi-step initiative intake submission
- Executive review and approval workflow
- Role-based access control (Approvers vs Requesters)
- Analytics and reporting dashboards
- Configurable form fields via admin interface
- Integration hooks for JIRA (IPCS) and PI for ROM input

---

## 2. Intake Form Requirements

### 2.1 Form Structure
The intake form is a **4-step wizard** with the following sections:

| Step | Title | Description |
|------|-------|-------------|
| 1 | Basic Info | Core initiative details and classification |
| 2 | Investment | Labor and non-labor investment breakdown |
| 3 | Scope & Value | Work scope and ROI justification |
| 4 | Risks & Dependencies | Risk assessment and dependencies |

### 2.2 Form Fields by Step

#### Step 1: Basic Information

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| Initiative Title | `text` | Yes | Max 150 chars | Clear, descriptive title |
| Business Case | `textarea` | Yes | Max 2000 chars | Business justification |
| Owner Name | `text` | Yes | Max 100 chars | Initiative owner |
| Requester Stakeholders | `text` | Yes | Max 500 chars | Comma-separated SIDs |
| SEAL ID(s) | `text` + validation | No | Max 200 chars | Validated against SEAL server |
| Overview | `textarea` | Yes | Max 5000 chars | Comprehensive overview |
| Is GT SIG? | `switch` | No | Boolean | Toggle for GT SIG classification |
| Category | `select` | Yes | Enum | Mandatory / Discretionary / Regulatory |
| Work Type | `select` | Yes | Enum | New / Expansion / Change to Existing |

#### Step 2: Investment Model

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| ROM Scope Sizing | `currency` | Yes | Min 0 | Rough Order of Magnitude |
| Timeframe | `select` | Yes | Enum | Multi-Year / One Year / 6 Months / Quarter / Immediate |
| Domain Selection | `multiselect` | No | — | CFP, CPNS, GTI, GTO, Enterprise, Infrastructure, Security, Data |
| **Per-Domain Investment Fields:** |
| Existing Heads Committed | `number` | Yes | Min 0 | Existing allocated heads |
| Deferred Incremental | `number` | Yes | Min 0 | Deferred incremental labor |
| Total New Ask | `number` | Yes | Min 0 | New labor request |
| Next Phase Ask | `number` | Yes | Min 0 | Future phase labor |
| Non-Labor Ask | `textarea` | No | Max 1500 chars | Non-labor costs description |

#### Step 3: Scope & Value

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| Work In Scope | `textarea` | Yes | Max 3000 chars | Detailed scope description |
| Value/ROI Measure | `textarea` | Yes | Max 2000 chars | ROI justification |

#### Step 4: Risks & Dependencies

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| Risks If Not Implemented | `textarea` | Yes | Max 2000 chars | Business risk assessment |
| Dependencies | `textarea` | No | Max 1500 chars | External dependencies |
| Resource Availability | `textarea` | No | Max 1000 chars | Resource constraints |

### 2.3 Form Behavior
- Auto-generates Initiative ID on submission (format: `INI-YYYY-NNN`)
- SEAL ID validation against mock/external SEAL server
- Step indicator with completion status
- Form validation with Zod schema
- Toast notifications on submission

---

## 3. Dashboard View Requirements

### 3.1 Overview
The dashboard provides a real-time view of all initiatives with filtering, search, and quick stats.

### 3.2 Components

#### Summary Statistics Cards (Clickable Filters)
| Card | Description | Click Action |
|------|-------------|--------------|
| Total Initiatives | Count of all initiatives | Filter: Show all |
| Pending Review | Count of pending status | Filter: pending only |
| Approved | Count of approved status | Filter: approved only |
| Denied | Count of denied status | Filter: denied only |

#### Search & Filter Bar
| Control | Type | Options |
|---------|------|---------|
| Search | `text input` | Search by title, owner, submitter |
| Status Filter | `select` | All / Pending / Approved / Denied |
| Category Filter | `select` | All / Mandatory / Discretionary / Regulatory |

#### Initiative Grid
- Card-based layout (responsive: 1-3 columns)
- Each card displays:
  - Initiative title
  - Status badge (with animation)
  - Owner name
  - Category badge
  - Submission date
  - ROM amount
- Click to navigate to Impact Assessment view

#### Empty State
- Displayed when no initiatives match filters
- Icon, heading, and suggestion text

---

## 4. Reports View Requirements

### 4.1 Overview
Analytics dashboard providing insights on initiative submissions, approvals, and trends.

### 4.2 Filters
| Filter | Type | Options |
|--------|------|---------|
| Time Period | `select` | All Time / This Week / This Month / This Quarter |
| Origin (LOB) | `select` | All Origins / Dynamic list of Line of Business values |

### 4.3 Summary Statistics
| Metric | Description |
|--------|-------------|
| Total Submitted | Count of all filtered initiatives |
| Approved | Count of approved initiatives |
| Denied | Count of denied initiatives |
| Approval Rate | Percentage (approved / non-pending) |

### 4.4 Visualizations

| Chart | Type | Data |
|-------|------|------|
| Status Distribution | Pie Chart (donut) | Approved / Denied / Pending counts |
| By Category | Bar Chart | Mandatory / Discretionary / Regulatory counts |
| Monthly Trend | Line Chart | Approved vs Denied over time |
| By Line of Business | Summary Cards | Per-LOB breakdown of status counts |

### 4.5 Additional Components
- **Recent Submissions Table**: Last 5 initiatives with status badges, clickable rows
- **Export to CSV**: Download filtered data with columns:
  - Initiative ID, Title, Status, Category, Owner, Submitted By, Submitted At, ROM, Timeframe, Work Type, Line of Business, Assessor Name, Assessed At

---

## 5. Admin Settings Requirements

### 5.1 Overview
Administration interface for managing users, permissions, and form configuration.

### 5.2 Tabs
| Tab | Description |
|-----|-------------|
| User Permissions | Manage approvers and requesters |
| Form Configuration | Customize intake form fields |

### 5.3 User Permissions Tab

#### Summary Statistics
| Stat | Description |
|------|-------------|
| Total Users | Count of all users |
| Approvers | Count of users with approver role |
| Requesters | Count of users with requester role |

#### Add New User Form
| Field | Type | Required | Options |
|-------|------|----------|---------|
| User Name | `text` | Yes | — |
| SID | `text` | Yes | — |
| Role | `select` | Yes | Requester / Approver |
| Category | `select` | Yes | LOB / GTLT / Product |

#### User Search
- Search by name or SID
- Display user cards with:
  - Avatar (initials)
  - Name, SID
  - Role badge
  - Category badge

#### User Lists
| List | Description | Actions |
|------|-------------|---------|
| Approvers | Users who can approve/deny | Demote / Remove |
| Requesters | Users who can submit | Promote / Remove |

### 5.4 Form Configuration Tab
- View and edit intake form structure
- Configure:
  - Field labels
  - Field types
  - Required status
  - Placeholders
  - Options (for select fields)
  - Field order
  - Domain options for investment fields
- Support for field types:
  - `text`, `textarea`, `number`, `select`, `switch`, `date`, `multiselect`, `currency`, `domain-investment`, `repeatable-group`

---

## 6. Data Types Reference

### 6.1 Initiative Status
```typescript
type InitiativeStatus = 'pending' | 'approved' | 'denied';
```

### 6.2 Category
```typescript
type Category = 'Mandatory' | 'Discretionary' | 'Regulatory';
```

### 6.3 Work Type
```typescript
type WorkType = 'New' | 'Expansion' | 'Change to Existing';
```

### 6.4 Timeframe
```typescript
type Timeframe = 'Multi-Year' | 'One Year' | '6 Months' | 'Quarter' | 'Immediate';
```

### 6.5 User Roles
```typescript
type UserRole = 'approver' | 'requester' | 'admin';
```

### 6.6 User Categories
```typescript
type UserCategory = 'LOB' | 'GTLT' | 'Product';
```

---

## 7. Integration Points

| Integration | Purpose | Status |
|-------------|---------|--------|
| SEAL Server | Validate SEAL IDs | Mock implementation |
| JIRA (IPCS) | Route approved initiatives | Planned (routing hooks) |
| PI System | ROM input integration | Planned (routing hooks) |

---

## 8. Design System

### Color Palette
- **Primary**: Deep Navy (executive gravitas)
- **Accent**: Gold (executive premium feel)
- **Success**: Green (approved status)
- **Destructive**: Red (denied status)
- **Warning/Pending**: Amber/Gold

### Typography
- **Display Font**: Sora (geometric sans-serif)
- **Body Font**: System sans-serif stack

### Components
- Built on shadcn/ui component library
- Custom `executive-card` styling for premium look
- Animated status badges with pulse effects
- Responsive grid layouts

---

*Document generated: February 2026*
*Version: 1.0*
