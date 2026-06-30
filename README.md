# Mini CRM - Client Lead Management System

A full-stack **Client Lead Management System (Mini CRM)** built as part of an Future intern internship project. This application helps businesses manage leads generated from website contact forms with a clean, modern UI and secure authentication.


---

## 📸 Project Preview

| Dashboard | Leads Table | Add Lead |
|-----------|-------------|----------|
| Stats cards with total leads | Search, filter, edit, delete | Form with validation |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (Vite), HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcryptjs |
| **HTTP Client** | Axios |
| **Routing** | React Router DOM |

---

## ✨ Features

- ✅ **Admin Login** with JWT authentication
- ✅ **Dashboard** showing Total, New, Contacted, and Converted Leads
- ✅ **Add Lead Form** with Name, Email, Source, Status, Notes, Follow-up Date
- ✅ **Lead Table** with Edit and Delete options
- ✅ **Complete CRUD Operations** (Create, Read, Update, Delete)
- ✅ **Protected Routes** (redirects unauthenticated users)
- ✅ **Responsive Design** with modern blue theme
- ✅ **Search & Filter** leads by name, email, or status

---
## Structure
mini-crm-final/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Lead.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── leads.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Leads.jsx
    │   │   ├── AddLead.jsx
    │   │   └── EditLead.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
🔗 GitHub Repo Link 

https://github.com/Asfiya28/FUTURE_FS_02
