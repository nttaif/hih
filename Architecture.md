src/
├── common/                  # 🌐 NHỮNG THỨ DÙNG CHUNG TOÀN APP
│   ├── decorators/          # (@CurrentUser, @Roles)
│   ├── filters/             # (Global Exception Handler)
│   ├── guards/              # (AuthGuard, ApproveGuard)
│   ├── interceptors/        # (Transform Response)
│   └── interfaces/          # (Các Interface chung)
│
├── config/                  # ⚙️ CẤU HÌNH (Đã làm)
│   └── env.validation.ts
│
├── modules/                 # 📦 CÁC FEATURE MODULES (Chia theo nghiệp vụ)
│   ├── auth/                # (Login, Register, JWT)
│   ├── users/               # (User Management)
│   ├── groups/              # (Group Logic)
│   │
│   └── media/               # (Media Logic - Quan trọng nhất)
│       ├── dto/
│       ├── entities/
│       ├── controllers/
│       ├── services/
│       └── providers/       # ☁️ CHỨA LOGIC GOOGLE DRIVE
│           └── google-drive.provider.ts
│
├── database/                # 🗄️ DATABASE MIGRATIONS & SEEDS
│
└── main.ts                  # Entry point