// lib/prisma.ts
// Compatibility shim: older code imports "@/lib/prisma".
// We re-export the canonical Prisma client from "@/lib/db" (adapter-based).
export { prisma } from "./db";
