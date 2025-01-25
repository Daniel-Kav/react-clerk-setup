import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar, boolean, date, decimal, uuid, pgEnum, integer, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";

export const role_enum = pgEnum('role_enum', ['admin', 'user','super_admin']);
// ,'captain','vice_captain'

export const gameCategoryEnum = pgEnum('game_category_enum', [
    'BATTLE_ROYALE',
    'MULTIPLAYER',
    'SPORTS_1V1',
    'SPORTS_2V2',
    'FIGHTING'
]);

export const registrationTypeEnum = pgEnum('registration_type_enum', [
    'CAPTAIN_ONLY',
    'OPEN'
]);

export const regionEnum = pgEnum('region_enum', [
    'NAIROBI_NORTH',
    'NAIROBI_SOUTH',
    'CENTRAL',
    'COAST',
    'RIFT_VALLEY_NORTH',
    'RIFT_VALLEY_SOUTH',
    'WESTERN',
    'NYANZA'
]);

export const genderEnum = pgEnum('gender_enum', [
    'MALE',
    'FEMALE',
    'ANY'
]);

//users table 
export const users = pgTable("users", {
    user_id: uuid('user_id').defaultRandom().primaryKey(),
    full_name: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    contact_phone: varchar('contact_phone', { length: 20 }).notNull(),
    university_id: uuid('university_id').references(() => universities.university_id, { onDelete: 'set null' }),
    discord_name: varchar('discord_name', { length: 100 }),
    gender: genderEnum('gender'),
    gamertag: varchar('gamertag', { length: 100 }),
    verification_id: uuid('verification_id'),
    is_profile_complete: boolean('is_profile_complete').default(false),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
    emailIdx: index('email_idx').on(table.email)
}));

export const userRelations = relations(users, ({ one, many }) => ({
    university: one(universities, {
        fields: [users.university_id],
        references: [universities.university_id]
    }),
    preferences: many(userPreferences),
    auths: one(auths, {
        fields: [users.user_id],
        references: [auths.user_id]
    }),
    studentVerification: one(studentVerifications, {
        fields: [users.verification_id],
        references: [studentVerifications.verification_id]
    }),
    teamMemberships: many(teamMembers)
}));

export const preferenceTypeEnum = pgEnum('preference_type', [
    'EMAIL_ALERT',
    'SMS_ALERT',
    'PUSH_ALERT',
    'COMPANY_NEWS',
    'ACCOUNT_ACTIVITY',
    'NEW_MESSAGES',
    'RATING_REMINDERS',
    'UPDATE_NOTIFICATIONS',
    'COMMENT_NOTIFICATIONS',
    'BUYER_REVIEWS',
    'MARKETING'
]);


export const userPreferences = pgTable('user_preferences', {
    preference_id: uuid('preference_id').defaultRandom().primaryKey(),
    user_id: uuid('user_id')
        .notNull()
        .references(() => users.user_id, { onDelete: 'cascade' }),
    type: preferenceTypeEnum('type').notNull(),
    opted_in: boolean('opted_in').default(false),
    is_student_seller_only: boolean('is_student_seller_only').default(false),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
    userTypeIdx: index('user_type_idx').on(table.user_id, table.type),
}));

export const preferenceRelations = relations(userPreferences, ({ one }) => ({
    user: one(users, {
        fields: [userPreferences.user_id],
        references: [users.user_id]
    })
}));



export const studentVerifications = pgTable("student_verifications", {
    verification_id: uuid('verification_id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').notNull().unique(),
    school_id_card: varchar('school_id'),
    student_email: varchar('student_email').notNull().unique(),
    student_email_verified: boolean('email_verified').default(false).notNull(),
    email_verification_token: varchar('email_verification_token'),
    email_verification_expires: timestamp('email_verification_expires'),
    is_verified: boolean('is_verified').default(false).notNull(),
    verification_date: timestamp('verification_date').defaultNow(),
    documents_submitted: boolean('documents_submitted').default(false).notNull(),
    documents_verified: boolean('documents_verified').default(false).notNull(),
    document_id: uuid('document_id'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
});

export const studentVerificationRelations = relations(studentVerifications, ({ one, many }) => ({
    user: one(users, {
        fields: [studentVerifications.user_id],
        references: [users.user_id]
    }),
    documents: many(verificationDocuments)
}));

export const docTypeEnum = pgEnum('doc_type_enum', ['national_id_card', 'student_id_card', 'admission_letter'])

export const verificationDocuments = pgTable("verification_documents", {
    document_id: uuid('document_id').defaultRandom().primaryKey(),
    verification_id: uuid('verification_id').notNull().references(() => studentVerifications.verification_id, { onDelete: 'cascade' }),
    document_type: docTypeEnum('document_type').notNull(),
    document_url: varchar('document_url').notNull(),
    uploaded_at: timestamp('uploaded_at').defaultNow(),
});

export const verificationDocumentRelations = relations(verificationDocuments, ({ one }) => ({
    verification: one(studentVerifications, {
        fields: [verificationDocuments.verification_id],
        references: [studentVerifications.verification_id]
    }),
}));


export const auths = pgTable("auth", {
    auth_id: uuid('auth_id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').notNull().references(() => users.user_id, { onDelete: 'cascade' }),
    email_verified: boolean('email_verified').default(false).notNull(),
    email_verification_token: varchar('email_verification_token'),
    email_verification_expires: timestamp('email_verification_expires'),
    password_hash: varchar('password').notNull(),
    reset_password_token: varchar('reset_password_token'),
    reset_password_expires: timestamp('reset_password_expires'),
    role: role_enum('role').default('user').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
})

export const authRelations = relations(auths, ({ one, many }) => ({
    user: one(users, {
        fields: [auths.user_id],
        references: [users.user_id]
    })
}))

//universities table
export const universities = pgTable("universities", {
    university_id: uuid('university_id').defaultRandom().primaryKey(),
    university_name: varchar('university_name', { length: 255 }).notNull(),
    university_logo_url: varchar('university_logo_url', { length: 255 }),
    email_domain: varchar('email_domain', { length: 100 }),
    has_whatsapp_group: boolean('has_whatsapp_group').default(false),
    whatsapp_group_link: varchar('whatsapp_group_link', { length: 255 }),
    whatsapp_no: integer('whatsapp_no').default(0),
    has_leader: boolean('has_leader').default(false),
    location: varchar('location', { length: 255 }),
    region: varchar('region').notNull(),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
    nameIdx: index('uni_name_idx').on(table.university_name),
    regionIdx: index('uni_region_idx').on(table.region),
    emailDomainIdx: index('uni_email_domain_idx').on(table.email_domain)
}));

export const universityRelations = relations(universities, ({ one, many }) => ({
    users: many(users),
    teams: many(teams)
}))


//games table
export const games = pgTable("games", {
    game_id: uuid('game_id').defaultRandom().primaryKey(),
    game_name: varchar('game_name').notNull(),
    game_logo: varchar('game_logo'),
    description: text('description'),
    category: gameCategoryEnum('category').notNull(),
    registration_type: registrationTypeEnum('registration_type').notNull(),
    max_team_size: integer('max_team_size').notNull(),
    min_team_size: integer('min_team_size').notNull(),
    allowed_regions: regionEnum('allowed_regions').array(),
    allowed_gender: genderEnum('allowed_gender').default('ANY'),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
    nameIdx: index('game_name_idx').on(table.game_name),
    categoryIdx: index('game_category_idx').on(table.category),
    regionIdx: index('game_region_idx').on(table.allowed_regions)
}));


export const gameRelations = relations(games, ({ one, many }) => ({
    teams: many(teams),
    tournaments: many(tournaments),
    roles: many(playerRoles)
}))

export const playerRoles = pgTable("player_roles", {
    role_id: uuid('role_id').defaultRandom().primaryKey(),
    game_id: uuid('game_id').references(() => games.game_id),
    role_name: varchar('role_name').notNull(),
    description: text('description')
});

export const playerRoleRelations = relations(playerRoles, ({ one, many }) => ({
    game: one(games, {
        fields: [playerRoles.game_id],
        references: [games.game_id]
    }),
    teamMembers: one(teamMembers, {
        fields: [playerRoles.role_id],
        references: [teamMembers.role_id]
    })
}));

//teams table
export const teams = pgTable("teams", {
    team_id: uuid('team_id').defaultRandom().primaryKey(),
    team_name: varchar('team_name').notNull(),
    university_id: uuid('university_id').notNull().references(() => universities.university_id, { onDelete: 'restrict' }),
    game_id: uuid('game_id').notNull().references(() => games.game_id, { onDelete: 'restrict' }),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
}, (table) => ({
    nameIdx: index('team_name_idx').on(table.team_name),
    gameIdx: index('team_game_idx').on(table.game_id),
    uniIdx: index('team_uni_idx').on(table.university_id),
}));

export const teamRelations = relations(teams, ({ one, many }) => ({
    university: one(universities, {
        fields: [teams.university_id],
        references: [universities.university_id]
    }),
    game: one(games, {
        fields: [teams.game_id],
        references: [games.game_id]
    }),
    members: many(teamMembers),
    registrations: many(teamRegistrationStatus),
    tournamentResults: many(tournamentResults)
}));

export const memberStatusEnum = pgEnum('member_status_enum', [
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING'
]);

//team members table
export const teamMembers = pgTable("team_members", {
    member_id: uuid('member_id').defaultRandom().primaryKey(),
    team_id: uuid('team_id').notNull().references(() => teams.team_id, { onDelete: 'cascade' }),
    user_id: uuid('user_id').notNull().references(() => users.user_id, { onDelete: 'cascade' }),
    role_id: uuid('role_id').references(() => playerRoles.role_id, { onDelete: 'set null' }),
    joined_at: timestamp('joined_at').defaultNow(),
    status: memberStatusEnum('status').default('ACTIVE'),
    is_captain: boolean('is_captain').default(false),
    is_vice_captain: boolean('is_vice_captain').default(false),
    is_substitute: boolean('is_substitute').default(false),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
    teamUserIdx: uniqueIndex('team_user_idx').on(table.team_id, table.user_id),
    captainIdx: uniqueIndex('team_captain_idx').on(table.team_id).where(sql`is_captain = true`),
    viceCaptainIdx: uniqueIndex('team_vice_captain_idx').on(table.team_id).where(sql`is_vice_captain = true`),
    roleIdx: index('member_role_idx').on(table.role_id),
    statusIdx: index('member_status_idx').on(table.status)
}));

export const teamMemberRelations = relations(teamMembers, ({ one }) => ({
    user: one(users, {
        fields: [teamMembers.user_id],
        references: [users.user_id]
    }),
    team: one(teams, {
        fields: [teamMembers.team_id],
        references: [teams.team_id]
    }),
    role: one(playerRoles, {
        fields: [teamMembers.role_id],
        references: [playerRoles.role_id]
    })
}));

export const registrationStatusEnum = pgEnum('registration_status_enum', [
    'PENDING',
    'APPROVED',
    'REJECTED'
]);


export const teamRegistrationStatus = pgTable("team_registration_status", {
    registration_id: uuid('registration_id').defaultRandom().primaryKey(),
    team_id: uuid('team_id').references(() => teams.team_id),
    tournament_id: uuid('tournament_id').references(() => tournaments.tournament_id),
    status: registrationStatusEnum('status').default('PENDING').notNull(),
    registration_date: timestamp('registration_date').defaultNow(),
    verification_date: timestamp('verification_date'),
    verified_by: uuid('verified_by').references(() => users.user_id),
    rejection_reason: text('rejection_reason'),
    updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
    teamIdx: index('team_idx').on(table.team_id)
}))

export const teamRegistrationStatusRelations = relations(teamRegistrationStatus, ({ one }) => ({
    team: one(teams, {
        fields: [teamRegistrationStatus.team_id],
        references: [teams.team_id]
    }),
    tournament: one(tournaments, {
        fields: [teamRegistrationStatus.tournament_id],
        references: [tournaments.tournament_id]
    }),
    //let the ADMINS be the oneS who verified the registration
    verifiedByUser: one(users, {
        fields: [teamRegistrationStatus.verified_by],
        references: [users.user_id]
    })
}));

export const tournamentStatusEnum = pgEnum('tournament_status_enum', [
    'UPCOMING',
    'REGISTRATION_OPEN',
    'REGISTRATION_CLOSED',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED',
    'ON_HOLD'
]);

//tournaments table
export const tournaments = pgTable("tournaments", {
    tournament_id: uuid('tournament_id').defaultRandom().primaryKey(),
    game_id: uuid('game_id').notNull().references(() => games.game_id, { onDelete: 'cascade' }),
    tournament_name: varchar('tournament_name').notNull(),
    description: text('description'),
    registration_deadline: date('registration_deadline').notNull(),
    status: tournamentStatusEnum('status').notNull().default('UPCOMING'),
    start_date: timestamp('start_date').notNull(),
    end_date: timestamp('end_date').notNull(),
    rules: text('rules'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
    gameIdx: index('tournament_game_idx').on(table.game_id),
    dateIdx: index('tournament_date_idx').on(table.start_date),
    nameIdx: index('tournament_name_idx').on(table.tournament_name)
}));

export const tournamentRelations = relations(tournaments, ({ one, many }) => ({
    game: one(games, {
        fields: [tournaments.game_id],
        references: [games.game_id]
    }),
    registrations: many(teamRegistrationStatus),
    results: many(tournamentResults)
}))

export const tournamentResultsEnum = pgEnum('tournament_results_enum', [
    'WINNER',
    'RUNNER_UP',
    'SEMI_FINALIST',
    'QUARTER_FINALIST',
    'ELIMINATED'
]);

export const tournamentResults = pgTable("tournament_results", {
    result_id: uuid('result_id').defaultRandom().primaryKey(),
    team_id: uuid('team_id').notNull().references(() => teams.team_id, { onDelete: 'cascade' }),
    tournament_id: uuid('tournament_id').notNull().references(() => tournaments.tournament_id, { onDelete: 'cascade' }),
    position: tournamentResultsEnum('position').notNull(),
    matches_played: integer('matches_played').default(0),
    matches_won: integer('matches_won').default(0),
    matches_lost: integer('matches_lost').default(0),
    points_scored: integer('points_scored').default(0),
    prize_amount: decimal('prize_amount', { precision: 10, scale: 2 }).default('0'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
    teamIdx: index('result_team_idx').on(table.team_id),
    tournamentIdx: index('result_tournament_idx').on(table.tournament_id),
    positionIdx: index('result_position_idx').on(table.position)
}));

export const tournamentResultsRelations = relations(tournamentResults, ({ one }) => ({
    team: one(teams, {
        fields: [tournamentResults.team_id],
        references: [teams.team_id]
    }),
    tournament: one(tournaments, {
        fields: [tournamentResults.tournament_id],
        references: [tournaments.tournament_id]
    })
}));

//news table
export const news = pgTable("news", {
    news_id: uuid('news_id').defaultRandom().primaryKey(),
    title: varchar('title').notNull(),
    content: text('content').notNull(),
    author_id: uuid('author_id').notNull().references(() => users.user_id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
})

export const newsRelations = relations(news, ({ one, many }) => ({
    users: one(users, {
        fields: [news.author_id],
        references: [users.user_id]
    })
}))
//events table

export const events = pgTable("events", {
    event_id: uuid('event_id').defaultRandom().primaryKey(),
    event_name: varchar('event_name').notNull(),
    description: text('description'),
    event_date: date('event_date').notNull(),
    location: varchar('location'),
    created_at: timestamp('created_at').defaultNow()
})

//sponsors table

export const sponsors = pgTable("sponsors", {
    sponsor_id: uuid('sponsor_id').defaultRandom().primaryKey(),
    sponsor_name: varchar('sponsor_name').notNull(),
    sponsor_logo: varchar('sponsor_logo'),
    sponsor_url: varchar('sponsor_url')
})

//admins table
export const admins = pgTable("admins", {
    admin_id: uuid('admin_id').defaultRandom().primaryKey(),
    full_name: varchar('full_name').notNull(),
    role: role_enum('role').default('admin').notNull(),
    bio: text('bio'),
    contact_info: varchar('contact_info')
})

//donations Table

export const donations = pgTable("donations", {
    donation_id: uuid('donation_id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').notNull().references(() => users.user_id, { onDelete: 'cascade' }),
    amount: decimal('amount').notNull(),
    donation_date: timestamp('donation_date').defaultNow()
})

export const donationRelations = relations(donations, ({ one, many }) => ({
    user: one(users, {
        fields: [donations.user_id],
        references: [users.user_id]
    })
}))

export type TIusers = typeof users.$inferInsert
export type TSusers = typeof users.$inferSelect

export type TIuserPreferences = typeof userPreferences.$inferInsert
export type TSuserPreferences = typeof userPreferences.$inferSelect

export type TIstudentVerifications = typeof studentVerifications.$inferInsert;
export type TSstudentVerifications = typeof studentVerifications.$inferSelect;

export type TIverificationDocuments = typeof verificationDocuments.$inferInsert;
export type TSverificationDocuments = typeof verificationDocuments.$inferSelect;


export type TIuniversities = typeof universities.$inferInsert
export type TSuniversities = typeof universities.$inferSelect


export type TIgames = typeof games.$inferInsert
export type TSgames = typeof games.$inferSelect

export type TIteams = typeof teams.$inferInsert
export type TSteams = typeof teams.$inferSelect

export type TIteamMembers = typeof teamMembers.$inferInsert
export type TSteamMembers = typeof teamMembers.$inferSelect

export type TItournaments = typeof tournaments.$inferInsert
export type TStournaments = typeof tournaments.$inferSelect

export type TItournamentResults = typeof tournamentResults.$inferInsert
export type TStournamentResults = typeof tournamentResults.$inferSelect

export type TInews = typeof news.$inferInsert
export type TSnews = typeof news.$inferSelect

export type TIevents = typeof events.$inferInsert
export type TSevents = typeof events.$inferSelect

export type TIsponsors = typeof sponsors.$inferInsert
export type TSsponsors = typeof sponsors.$inferSelect

export type TIadmins = typeof admins.$inferInsert
export type TSadmins = typeof admins.$inferSelect

export type TIdonations = typeof donations.$inferInsert
export type TSdonations = typeof donations.$inferSelect

export type TIauth = typeof auths.$inferInsert
export type TSauth = typeof auths.$inferSelect
