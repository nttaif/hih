# 📸 Digital Memory Box

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Google Drive](https://img.shields.io/badge/Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

> **A digital memory storage platform for close friends and family.**
> Combining the modular architecture of NestJS with the limitless storage of Google Drive.

---

## 📖 Introduction

**Digital Memory Box** is a Backend (API) project built to facilitate high-quality image and video storage for small groups (approx. 5-10 users) with cost efficiency in mind. 

Instead of incurring high costs for VPS storage, the system leverages **Google Drive** as the physical storage layer for binary files, while **PostgreSQL** handles metadata, categorization, and strict access control logic.

### 🌟 Key Features

* **☁️ Google Drive Integration:** Seamlessly upload and stream videos/images directly from Google Drive via API.
* **🛡️ Access Control System:**
    * **Group System:** Content is isolated; only members of a specific group can view shared memories.
    * **Strict Approval:** New registrations are locked by default. Accounts must be manually approved by an Admin (`IsApproved = true`) before they can upload or view content.
* **📂 Smart Organization:** Categorize memories into distinct albums (e.g., "Summer Trip", "Yearbook", "Birthday").
* **📊 Analytics & Sorting:**
    * **View Counter:** Track popularity of uploads.
    * **Flexible Sorting:** Sort by *Newest*, *A-Z*, or *Most Viewed*.
* **🐳 Production Ready:** Fully integrated with Docker, CI/CD pipelines, and standard development workflows.

---

## 🛠️ Tech Stack

The project adheres to modern engineering standards and strict CI/CD processes.

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | NestJS | Scalable & modular Node.js Framework. |
| **Database** | PostgreSQL | Robust relational database management system. |
| **ORM** | TypeORM | Entity management and Database Migrations. |
| **Storage** | Google Drive API | External binary file storage service. |
| **DevOps** | Docker & Compose | Containerization for consistent environments. |
| **CI/CD** | GitHub Actions | Automated Testing and Docker Image Building. |
| **Quality Control** | Husky, Commitlint | Enforces Code Style and Conventional Commits. |

---

## 🚀 Installation & Deployment

### 1. Prerequisites
* Node.js >= 18
* Docker & Docker Compose
* Google Cloud Service Account (JSON key file)

### 2. Getting Started

**Step 1: Clone the repository**
```bash
git clone

---
**Step 2: Run dev enviroment **
```bash
docker compose -f docker-compose.dev.yml up -d

docker compose -f docker-compose.test.yml up -d
docker exec hih_api_test npm run test
docker compose -f docker-compose.test.yml down -v

docker compose -f docker-compose.prod.yml up -d --build