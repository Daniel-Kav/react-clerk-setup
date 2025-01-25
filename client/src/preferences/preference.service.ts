import db from "../drizzle/db";
import {  userPreferences } from "../drizzle/schema";

export const createDefaultPreferences = async (userId: string): Promise<void> => {
    const defaultPreferences = [
        'EMAIL_ALERT', 'SMS_ALERT', 'PUSH_ALERT',
        'COMPANY_NEWS', 'ACCOUNT_ACTIVITY', 'NEW_MESSAGES',
        'RATING_REMINDERS', 'UPDATE_NOTIFICATIONS', 'COMMENT_NOTIFICATIONS',
        'BUYER_REVIEWS', 'MARKETING'
      ] as const;
      
      await db.insert(userPreferences).values(
        defaultPreferences.map(type => ({
          user_id: userId,
          type,
          opted_in: false,
          is_student_seller_only: false
        }))
      );
}