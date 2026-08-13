import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user", "guest"]);

export type UserRole = (typeof userRoleEnum.enumValues)[number];
