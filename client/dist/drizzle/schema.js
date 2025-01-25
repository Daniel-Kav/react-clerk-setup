"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.varchar)('id').primaryKey(),
    clerkId: (0, pg_core_1.varchar)('clerk_id').notNull(),
    firstName: (0, pg_core_1.varchar)('first_name'),
    lastName: (0, pg_core_1.varchar)('last_name'),
    email: (0, pg_core_1.varchar)('email').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
