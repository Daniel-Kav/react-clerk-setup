import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  clerkId: varchar('clerk_id').notNull(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  email: varchar('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;