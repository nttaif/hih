# 🛠️ NestJS Resource Generator

This utility script automates the creation of a **production-ready** NestJS Feature Module. Unlike the standard CLI, this generator produces code optimized for **TypeORM (PostgreSQL)**, including **Swagger** documentation, **Soft Delete** logic, and **Unit Test** boilerplates.

---

## 📋 Prerequisites

Ensure your project has the following dependencies installed (as the generated code relies on them):

## How to Use

Run the script using ts-node from the project root directory.

npx ts-node .template/feature.generator.ts <feature-name>

### Examples

1. Simple Name: Generates a product module.

Bash
npx ts-node .template/feature.generator.ts product

2. CamelCase Name (Automatic conversion): Generates a user-log module (folder) with UserLog class names.

Bash
npx ts-node .template/gen-resource.ts UserLog
```bash
npm install @nestjs/typeorm typeorm class-validator class-transformer @nestjs/swagger

