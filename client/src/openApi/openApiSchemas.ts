import { z } from "@hono/zod-openapi";
export const OpenParamsSchema = z.object({
    id: z.string().min(3).openapi({
        param: {
            name: 'id',
            in: 'path'
        },
        example: 'd455c72c-69f1-4aea-8011-cb4349ab2488'
    })
})

//a message schema
export const openMessageSchema = z.object({
    message: z.string().openapi({
        example: 'Registration successful. Please verify your email.'
    })
})


export const openRegisterUserSchema = z.object({
    // Required body: { full_name, email, password, contactPhone, game_id, university_id }
    full_name: z.string().min(3, 'Full name must be at least 3 characters')
        .openapi({ description: 'Full name of the user', example: 'John Doe' }),
    email: z.string().email('Invalid email format')
        .openapi({ description: 'Email of the user', example: 'jonedoe@exmaple.com' }),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .openapi({ description: 'Password of the user', example: 'password' }),
    contactPhone: z.string().min(10, 'Contact phone must be at least 10 characters')
        .openapi({ description: 'Contact phone of the user', example: '+1234567890' }),
    game_id: z.string().uuid()
        .openapi({ description: 'UUID of the game', example: '123e4567-e89b-12d3-a456-426614174000' }),
    university_id: z.string().uuid()
        .openapi({ description: 'UUID of the university', example: '123e4567-e89b-12d3-a456-426614174000' })
}).strict().openapi('Register User');


export const openLoginUserSchema = z.object({
    email: z.string().email('Invalid email format')
        .openapi({ description: 'Email of the user', example: 'jonedoe@example.com' }),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .openapi({ description: 'Password of the user', example: 'password' })
}).strict().openapi('Login User');



export const openLoginResponseSchema = z.object({
    token: z.string().openapi({ description: 'JWT token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmIyODUxZTEtNjJhNS00MzMwLTk5ZmMtMjFhNzk2YTJmNmQ3Iiwicm9sZSI6InVzZXIifQ.06yoDSKfK1Kc8IgABOoVm' }),
    user: z.object({
        user_id: z.string().uuid().openapi({ description: 'UUID of the user', example: 'fb2851e1-62a5-4330-99fc-21a796a2f6d7' }),
        email: z.string().email('Invalid email format').openapi({ description: 'Email of the user', example: 'reyhanmark@gmail.com' }),
        role: z.string().openapi({ description: 'Role of the user', example: 'user' })
    }).openapi({ description: 'User object' })
}).openapi('Login Response');


export const openTokenSchema = z.object({
    token: z.string().openapi({ description: 'Email verification token', example: '' })
}).openapi('Verify Email Token');


export const openRequestPasswordResetSchema = z.object({
    email: z.string().email('Invalid email format').openapi({ description: 'Email of the user', example: 'jonedoe@gmail.com' })
}).openapi('Request Password Reset');



export const openUniversitySchema = z.object({
    university_id: z.string().uuid().openapi({
      example: "d455c72c-69f1-4aea-8011-cb4349ab2488"
    }),
    university_name: z.string().openapi({
      description: "Name of the university",
      example: "Stanford University"
    }),
    university_logo_url: z.string().url().openapi({
      description: "URL to the university logo",
      example: "https://example.com/logo.jpg"
    }),
    email_domain: z.string().openapi({
        description: "University email domain",
        example: "stanford.edu"
        }),
    has_whatsapp_group: z.boolean().openapi({
        description: "Has WhatsApp group",
        example: true
        }),
    whatsapp_group_link: z.string().url().openapi({
        description: "URL to the WhatsApp group",
        example: "https://example.com/whatsapp"
        }),
    whatsapp_no: z.number().openapi({
        description: "WhatsApp number",
        example: 1234567890
        }),
    has_leader: z.boolean().openapi({
        description: "Has leader",
        example: true
        }),
    location: z.string().openapi({
        description: "Location of the university",
        example: "Stanford, California"
        }),
    region: z.string().openapi({
        description: "Region of the university",
        example: "California"
        })
}).openapi('University');

export const openArrayResponseSchema = <T extends z.ZodType>(schema: T, statusCode: number, data: string) => z.object({
    [data]: z.array(schema),
    status: z.number().openapi({
        description: "HTTP status code",
        example: statusCode
    })
}).openapi('Array Response');

export const openSingleResponseSchema = <T extends z.ZodType>(schema: T, statusCode: number,data: string) => z.object({
    [data]: schema,
    status: z.number().openapi({
        description: "HTTP status code",
        example: statusCode
    })
}).openapi('Single Response');


export const openGameSchema = z.object({
    game_id: z.string().uuid().openapi({
        example: "b66ee265-4807-4e03-860b-3284ad9a58ec"
    }),
    game_name: z.string().openapi({
        description: "Name of the game",
        example: "EA FC"
    }),
    game_logo: z.string().url().openapi({
        description: "URL to the game logo",
        example: "https://example.com/eafc-logo.png"
    }),
    description: z.string().openapi({
        description: "Description of the game",
        example: "Team-based soccer gaming experience"
    }),
    category: z.string().openapi({
        description: "Category of the game",
        example: "SPORTS_2V2"
    }),
    registration_type: z.string().openapi({
        description: "Registration type",
        example: "OPEN"
    }),
    max_team_size: z.number().openapi({
        description: "Maximum team size",
        example: 2
    }),
    min_team_size: z.number().openapi({
        description: "Minimum team size",
        example: 2
    }),
    allowed_regions: z.array(z.string()).openapi({
        description: "Allowed regions",
        example: ["NAIROBI"]
    }),
  }).openapi('Game');

export const openUserSchema = z.object({
    user_id: z.string().uuid().openapi({
        example: "f35f9a81-249a-4a7a-8f51-faf0015ce07e"
    }),
    full_name: z.string().openapi({
        description: "Full name of the user",
        example: "reyhan"
    }),
    email: z.string().email('Invalid email format').openapi({
        description: "Email of the user",
        example: "johndoe@gmail.com"
    }),
    contact_phone: z.string().openapi({
        description: "Contact phone of the user",
        example: "0710908080"
    }),
    university_id: z.string().uuid().openapi({
        example: "52238c20-6fbd-46bf-ba6d-d76ba7602463"
    }),
    discord_name: z.string().nullable().openapi({
        description: "Discord name",
        example: "reyhan#1234"
    }),
    gamertag: z.string().nullable().openapi({
        description: "Gamertag of the user",
        example: "GamerJohn"
    }),
    game_id: z.string().nullable().openapi({
        example: "123e4567-e89b-12d3-a456-426614174000"
    }),
    verification_id: z.string().nullable().openapi({
        example: "123e4567-e89b-12d3-a456-426614174000"
    }),
    is_profile_complete: z.boolean().nullable().openapi({
        example: false
    }),
    created_at: z.string().openapi({
        example: "2024-12-22T19:04:58.478Z"
    }),
    updated_at: z.string().openapi({
        example: "2024-12-22T19:04:58.829Z"
    }),
    auths: z.object({
        user_id: z.string().uuid().openapi({
            example: "f35f9a81-249a-4a7a-8f51-faf0015ce07e"
        }),
        email_verified: z.boolean().nullable().openapi({
            example: false
        }),
        role: z.string().openapi({
            example: "user"
        })
    }),
    preferences: z.array(z.object({
        preference_id: z.string().uuid().openapi({
            example: "9bc5545d-22c1-452a-93c9-9845f58a47c1"
        }),
        type: z.string().openapi({
            example: "EMAIL_ALERT"
        }),
        opted_in: z.boolean().nullable().openapi({
            example: false
        }),
        is_student_seller_only: z.boolean().nullable().openapi({
            example: false
        })
    }))
}).openapi('User');

