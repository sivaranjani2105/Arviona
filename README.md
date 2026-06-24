# 🎓 Arviona — AI-Powered Gamified Learning Ecosystem

> **"Not just an LMS — a learning adventure."**
> Arviona transforms traditional school education into a personalized, gamified, and adaptive learning journey powered by AI.

---

## 🌟 What is Arviona?

Arviona is a next-generation school learning platform that replaces boring dashboards with game-like engagement.

| Traditional LMS | Arviona |
|---|---|
| Lessons | 🗡️ Missions |
| Assignments | ⚔️ Quests |
| Exams / Tests | 👑 Boss Battles |
| Marks | 🌱 Mastery & Growth |

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Spring Boot 3, Spring Security, JPA/Hibernate |
| **Database** | PostgreSQL + Flyway Migrations |
| **Authentication** | JWT (Bearer Token) |
| **Styling** | Tailwind CSS (via Vite) + custom CSS |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/arviona.git
cd arviona
```

### 2. Configure the database
Create a PostgreSQL database and update `server/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/arviona
spring.datasource.username=YOUR_USER
spring.datasource.password=YOUR_PASSWORD
```

### 3. Run the backend
```bash
cd server
mvn spring-boot:run
```
Backend starts at `http://localhost:8080`

### 4. Run the frontend
```bash
cd client
npm install
npm run dev
```
Frontend starts at `http://localhost:5173`

---

## 🔐 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Student | student@arviona.com | password |
| Teacher | teacher@arviona.com | password |
| Parent | parent@arviona.com | password |
| Principal | principal@arviona.com | password |

---

## 🎮 Core Features

### For Students
- **🗺️ Daily Learning Journey** — Personalized mission timeline each day
- **⚔️ Quest System** — Chained quests with prerequisite locks
- **🐾 Learning Pet** — Virtual companion that hatches and evolves (Lion, Dragon, Panda, Owl, Penguin, Tiger)
- **🪙 Reward Store** — Spend earned coins on skins, themes, power-ups, accessories
- **🏆 XP & Levelling** — Every action earns XP; level up through learning
- **🔥 Streaks** — Daily consistency rewards (3, 7, 15, 30, 100, 365 days)
- **🏠 House System** — Compete in school-wide house point rankings
- **🤖 Arivo AI Tutor** — Adaptive AI mentor that knows your knowledge gaps
- **📊 Knowledge Map** — Visual mastery tracking per subject/topic/subtopic

### For Teachers
- **📋 Quest Builder** — Create quest chains with prerequisite locks
- **📊 Student Insights** — Per-student performance, engagement heatmaps, risk flags
- **📝 Written Notes** — Upload notes and materials directly to students
- **📅 Class Scheduling** — Create and publish live class events

### For Parents
- **📈 Child Growth Score** — Visual engagement and progress index
- **🔥 Consistency Streaks** — Monitor daily learning habits
- **⚡ Parent Challenges** — Engage with your child's learning journey
- **🚨 Risk Alerts** — Get notified when your child needs help

### For Principals
- **🏫 School Telemetry** — Real-time engagement metrics across all classes
- **📉 Risk Prediction** — Identify at-risk students before they fall behind
- **🏠 House Standings** — School-wide competition leaderboards
- **📊 Predictive Analytics** — Data-driven insights for school administrators

---

## 🗂️ Project Structure

```
arviona/
├── server/                         # Spring Boot backend
│   └── src/main/
│       ├── java/com/arviona/
│       │   ├── controller/         # REST API controllers
│       │   ├── model/              # JPA entities
│       │   ├── repository/         # Spring Data repositories
│       │   ├── service/            # Business logic
│       │   ├── dto/                # Data transfer objects
│       │   ├── security/           # JWT auth & filters
│       │   └── config/             # CORS, Security config
│       └── resources/
│           ├── db/migration/       # Flyway SQL migrations
│           └── application.properties
└── client/                         # React frontend
    └── src/
        ├── pages/
        │   ├── student/            # StudentDashboard, PrincipalDashboard
        │   ├── teacher/            # TeacherDashboard
        │   ├── parent/             # ParentDashboard
        │   └── LoginPage.jsx
        ├── context/
        │   ├── AuthContext.jsx     # JWT auth state
        │   └── DataContext.jsx     # Global app state & API handlers
        ├── components/             # Shared UI components
        └── services/               # API service layer
```

---

## 🧪 Flyway Migrations

| Version | Description |
|---|---|
| V1 | Core schema (users, roles, assignments, grades) |
| V2 | Gamification engine (XP, badges, houses, pets, quests, knowledge map) |
| V3 | Enterprise loops (store items, inventory, daily journeys, events, quest chains) |
| V4 | Principal role and demo account seed |

---

## 📄 License

MIT License — built with ❤️ for the future of education.
