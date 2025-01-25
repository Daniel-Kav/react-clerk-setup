import { de } from '@faker-js/faker/.';
import { al } from '@faker-js/faker/dist/airline-BLb3y-7w';
import { z } from 'zod';

const basePreferenceSchema = z.object({
    optedIn: z.boolean().default(false)
});

const detailedPreferenceSchema = basePreferenceSchema.extend({
    isStudentSellerOnly: z.boolean().default(false)
});

// Nested preference structure
const preferencesSchema = z.object({
    alerts: z.object({
        email: basePreferenceSchema.optional(),
        sms: basePreferenceSchema.optional(),
        push: basePreferenceSchema.optional()
    }),
    notificationPreferences: z.object({
        companyNews: detailedPreferenceSchema.optional(),
        accountActivity: detailedPreferenceSchema.optional(),
        newMessages: detailedPreferenceSchema.optional()
    }),
    emailPreferences: z.object({
        ratingReminders: detailedPreferenceSchema.optional(),
        updateNotifications: detailedPreferenceSchema.optional(),
        commentNotifications: detailedPreferenceSchema.optional(),
        buyerReviews: detailedPreferenceSchema.optional(),
        marketingNotifications: detailedPreferenceSchema.optional()
    })
});

export const authSchema = z.object({
    full_name: z.string(),
    email: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    contact_phone: z.string(),
    university_id: z.string()
});

export const authSigninSchema = z.object({
    email: z.string(),
    password: z.string()
});



export const emailSchema = z.object({
    email: z.string().email('Invalid email format')
});

export const verifyStudentSchema = z.object({
    user_id: z.string().uuid(),
    university_id: z.string().uuid(),
    student_id_card: z.string().min(1).optional(),
    documents: z.array(z.object({
        document_type: z.enum(['national_id_card', 'admission_letter']),
        document_url: z.string().url(),
    })).min(1),
}).refine((data) => {
    if (!data.student_id_card) {
        // Ensure both admission letter and national ID are provided
        const types = data.documents.map(doc => doc.document_type);
        return types.includes('admission_letter') && types.includes('national_id_card');
    }
    return true;
}, {
    message: "If school_id is not provided, admission_letter and national_id_card are required.",
    path: ['documents'],
});

const userFullSchema = z.object({
    user_id: z.string().uuid(),
    full_name: z.string(),
    email: z.string().email('Invalid email format'),
    contactPhone: z.string(),
    university_id: z.string().uuid(),
    discord_name: z.string(),
    gamertag: z.string(),
    game_id: z.string().uuid(),
});

export const usersSchema = userFullSchema.partial({
    discord_name: true,
    gamertag: true
});

// Full request schema
export const createUserWithPreferencesSchema = userFullSchema.extend({
    preferences: preferencesSchema
});


export const universitiesSchema = z.object({
    university_name: z.string(),
    university_logo_url: z.string().default(''),
    email_domain: z.string(),
    has_whatsapp_group: z.boolean(),
    whatsapp_group_link: z.string().optional(),
    whatsapp_no: z.number().default(0),
    has_leader: z.boolean().default(false),
    location: z.string().optional(),
    region: z.string().optional()
});

export const gamesSchema = z.object({
    game_name: z.string(),
    game_logo: z.string(),
    description: z.string(),
    category: z.string(),
    registration_type: z.string(),
    max_team_size: z.number(),
    min_team_size: z.number(),
    allowed_regions: z.array(z.string()),
    allowed_gender: z.string().default('ANY'),
});

export const teamsSchema = z.object({
    //  team_id: uuid('team_id').defaultRandom().primaryKey(),
    //     team_name: varchar('team_name').notNull(),
    //     university_id: uuid('university_id').notNull().references(() => universities.university_id, { onDelete: 'cascade' }),
    //     game_id: uuid('game_id').notNull().references(() => games.game_id, { onDelete: 'cascade' }),
    //     team_captain_id: uuid('team_captain_id').notNull().references(() => users.user_id, { onDelete: 'cascade' }),
    //     vice_captain_id: uuid('vice_captain_id').notNull().references(() => users.user_id, { onDelete: 'cascade' }),
    //     phone_captain: varchar('phone_captain').notNull(),
    //     phone_vice_captain: varchar('phone_vice_captain').notNull(),
    //     created_at: timestamp('created_at').defaultNow()

    team_name: z.string(),
    university_id: z.string(),
    game_id: z.string(),
    team_captain_id: z.string(),
    vice_captain_id: z.string(),
    phone_captain: z.string(),
    phone_vice_captain: z.string(),
});



export const teamMembersSchema = z.object({
    member_id: z.string(),
    team_id: z.string(),
    user_id: z.string(),
    joined_at: z.string()
});



export const tournamentsSchema = z.object({
    tournament_id: z.string(),
    game_id: z.string(),
    tournament_name: z.string(),
    description: z.string(),
    registration_deadline: z.string(),
    status: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    rules: z.string()
});



export const tournamentResultsSchema = z.object({
    result_id: z.string(),
    tournament_id: z.string(),
    team_id: z.string(),
    position: z.string()
});



export const newsSchema = z.object({
    news_id: z.string(),
    title: z.string(),
    content: z.string(),
    author_id: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});


export const eventsSchema = z.object({
    event_id: z.string(),
    event_name: z.string(),
    description: z.string(),
    event_date: z.string(),
    location: z.string(),
    created_at: z.string()
});


export const sponsorsSchema = z.object({
    sponsor_id: z.string(),
    sponsor_name: z.string(),
    sponsor_logo: z.string(),
    sponsor_url: z.string()
});

export const adminsSchema = z.object({
    admin_id: z.string(),
    full_name: z.string(),
    role: z.string(),
    bio: z.string(),
    contact_info: z.string()
});


export const donationsSchema = z.object({
    donation_id: z.string(),
    user_id: z.string(),
    amount: z.string(),
    donation_date: z.string()
});

export const passwordSchema = z.object({
    password: z.string()
      .min(8)
      .regex(/[A-Z]/, 'Password must contain uppercase letter')
      .regex(/[a-z]/, 'Password must contain lowercase letter')
      .regex(/\d/, 'Password must contain number')
  });




// Type inference
export type UserWithPreferences = z.infer<typeof createUserWithPreferencesSchema>;