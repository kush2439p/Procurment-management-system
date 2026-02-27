# Frontend AI Prompt Guide — Smart Procurement & Vendor Management System

---

## Project Overview

A Spring Boot enterprise procurement app running at **`http://localhost:8082`**.  
Swagger UI: `http://localhost:8082/swagger-ui.html`

**Roles:** `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_PROCUREMENT_MANAGER`, `ROLE_EMPLOYEE`  
**Statuses:** `PENDING` · `APPROVED` · `REJECTED` (for Requisitions & POs) | `ACTIVE` · `INACTIVE` (for Vendors)

---

## Authentication (JWT)

All protected routes require header: `Authorization: Bearer <token>`

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/login` | `{ username, password }` | `{ token, type, username, roles[] }` |
| POST | `/api/auth/register` | `{ username, password }` | `"User registered successfully..."` |

Store in localStorage: `procurementToken`, `procurementRoles`, `procurementUser`.

---

## All API Endpoints

### Vendors — `/vendor`
| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/vendor/all` | — |
| GET | `/vendor/{id}` | — |
| POST | `/vendor/create` | `{ name, email, contactNumber, address }` |
| PUT | `/vendor/update/{id}` | `{ name, email, contactNumber, address, status }` |
| DELETE | `/vendor/delete/{id}` | — |

### Requisitions — `/procurement/requisition`
| Method | Endpoint | Body / Params |
|--------|----------|---------------|
| GET | `/procurement/requisition/all` | — |
| GET | `/procurement/requisition/{id}` | — |
| POST | `/procurement/requisition/create` | See below ↓ |
| PATCH | `/procurement/requisition/update-status/{id}` | `?status=APPROVED` |

**Create Requisition body:**
```json
{
  "requisitionNumber": "REQ-2024-001",
  "status": "PENDING",
  "requestedBy": { "id": 1 },
  "items": [
    { "itemName": "MacBook Pro", "description": "14-inch M3", "quantity": 1, "unitPrice": 2500.00 }
  ]
}
```

### Purchase Orders — `/procurement/purchase-order`
| Method | Endpoint | Body / Params |
|--------|----------|---------------|
| GET | `/procurement/purchase-order/all` | — |
| GET | `/procurement/purchase-order/{id}` | — |
| POST | `/procurement/purchase-order/create` | See below ↓ |
| PATCH | `/procurement/purchase-order/update-status/{id}` | `?status=APPROVED` |

**Create PO body:**
```json
{
  "poNumber": "PO-2024-1001",
  "status": "PENDING",
  "vendor": { "id": 1 },
  "items": [
    { "itemName": "MacBook Pro", "quantity": 1, "unitPrice": 2500.00 }
  ]
}
```

### Approvals — `/procurement/approval`
| Method | Endpoint | Params |
|--------|----------|--------|
| GET | `/procurement/approval/all` | — |
| POST | `/procurement/approval/approve/{poId}` | `?approverId=1` |
| POST | `/procurement/approval/reject/{poId}` | `?approverId=1&reason=Budget+exceeded` |

### Reports — `/reports`
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/reports/vendor?format=pdf` | `{ vendorId, poId, startDate, endDate }` |
| POST | `/reports/vendor?format=excel` | same as above |

> Use `responseType: 'blob'` in Axios and trigger `<a>` download.

---

## Pages & Routes

```
/login               → Login form
/register            → Register form
/dashboard           → Stats cards + charts
/vendors             → Vendor table with CRUD
/vendors/new         → Create vendor
/vendors/:id/edit    → Edit vendor
/requisitions        → List with status tabs
/requisitions/new    → Create form (dynamic items)
/requisitions/:id    → Detail + status update
/purchase-orders     → List with filters
/purchase-orders/new → Create PO (pick vendor + items)
/purchase-orders/:id → Detail + Approve/Reject
/approvals           → Full audit trail
/reports             → Filter + download PDF/Excel
```

---

## Tech Stack

- **React 18**, React Router DOM v6, Axios
- **Framer Motion** — page transitions, staggered lists, animated counters
- **Recharts** — dashboard pie + bar charts
- **React Hot Toast** — notifications
- **Inter font** (Google Fonts)
- **Plain CSS** with CSS variables (no Tailwind)

---

## Design System

```css
:root {
  --primary:      #4F46E5;   /* indigo */
  --success:      #10B981;   /* green  — APPROVED / ACTIVE */
  --warning:      #F59E0B;   /* amber  — PENDING */
  --danger:       #EF4444;   /* red    — REJECTED */
  --bg:           #0F172A;   /* page background */
  --sidebar-bg:   #1E293B;
  --card-bg:      #334155;
  --text:         #E2E8F0;
  --text-muted:   #94A3B8;
}
```

- Dark theme, glassmorphism cards, collapsible sidebar
- Framer Motion on every page (fade + slide-up), staggered table rows, scale on button hover

---

## RBAC — Role-Based UI

```js
const roles = JSON.parse(localStorage.getItem('procurementRoles') || '[]');
const isAdmin    = () => roles.includes('ROLE_ADMIN');
const isManager  = () => roles.includes('ROLE_MANAGER') || isAdmin();
const isProcMgr  = () => roles.includes('ROLE_PROCUREMENT_MANAGER') || isAdmin();
```

| Feature | Admin | Manager | Proc. Mgr | Employee |
|---------|:-----:|:-------:|:---------:|:--------:|
| Create / Edit / Delete Vendor | ✅ | ❌ | ✅ | ❌ |
| Create Requisition | ✅ | ✅ | ✅ | ✅ |
| Approve / Reject Requisition | ✅ | ✅ | ❌ | ❌ |
| Create Purchase Order | ✅ | ❌ | ✅ | ❌ |
| Approve / Reject PO | ✅ | ✅ | ❌ | ❌ |
| Download Reports | ✅ | ✅ | ✅ | ❌ |

---

## Axios Setup

```js
// src/api/axiosInstance.js
import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:8082' });
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('procurementToken');
  if (token) cfg.headers['Authorization'] = `Bearer ${token}`;
  return cfg;
});
API.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  }
  return Promise.reject(err);
});
export default API;
```

---

## Ready-to-Paste AI Prompt

```
Build a complete, animated, dark-themed React 18 frontend for a Smart Procurement & Vendor Management System.

BACKEND: Spring Boot at http://localhost:8082. Auth: JWT Bearer token stored in localStorage as 'procurementToken'. All requests need: Authorization: Bearer <token>.

AUTH:
  POST /api/auth/login    → { username, password } → { token, type, username, roles[] }
  POST /api/auth/register → { username, password }

VENDORS (/vendor):
  GET /vendor/all | GET /vendor/{id}
  POST /vendor/create → { name, email, contactNumber, address }
  PUT  /vendor/update/{id} → same fields + status
  DELETE /vendor/delete/{id}

REQUISITIONS (/procurement/requisition):
  GET  /all | GET /{id}
  POST /create → { requisitionNumber, status:"PENDING", requestedBy:{id}, items:[{itemName,description,quantity,unitPrice}] }
  PATCH /update-status/{id}?status=APPROVED|REJECTED|PENDING

PURCHASE ORDERS (/procurement/purchase-order):
  GET  /all | GET /{id}
  POST /create → { poNumber, status:"PENDING", vendor:{id}, items:[{itemName,quantity,unitPrice}] }
  PATCH /update-status/{id}?status=APPROVED|REJECTED|PENDING

APPROVALS (/procurement/approval):
  GET  /all
  POST /approve/{poId}?approverId={id}
  POST /reject/{poId}?approverId={id}&reason={text}

REPORTS:
  POST /reports/vendor?format=pdf|excel → { vendorId, poId, startDate, endDate } → blob download

PAGES: /login, /register, /dashboard, /vendors (CRUD), /requisitions (CRUD), /purchase-orders (CRUD + approve/reject), /approvals, /reports

STACK: React 18, React Router v6, Axios, Framer Motion, Recharts, React Hot Toast, Inter font, plain CSS variables.

DESIGN: Dark theme (#0F172A bg, #1E293B sidebar, #334155 cards). Indigo (#4F46E5) primary, green (#10B981) success, amber (#F59E0B) warning, red (#EF4444) danger. Glassmorphism stat cards. Collapsible sidebar. Framer Motion page transitions (fade+slideUp), staggered table rows, animated number counters, button scale hover.

RBAC: Parse roles from localStorage. Show Approve/Reject only for ROLE_ADMIN and ROLE_MANAGER. Show Create PO / Manage Vendors only for ROLE_ADMIN and ROLE_PROCUREMENT_MANAGER.

QUALITY: Loading skeletons, toast on every mutation, 401→redirect to /login, mobile responsive.
```
