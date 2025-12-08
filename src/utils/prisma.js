import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);

dotenv.config({ path: join(__dirname, "../../.env") });
const { PrismaClient } = require("../../generated/prisma/index.js");



import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const connectionString = process.env.DATABASE_URL;


const pool = new pkg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({
  adapter,
  log: ["query"],
});
