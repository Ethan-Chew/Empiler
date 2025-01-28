CREATE TABLE IF NOT EXISTS "branch_appointments" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "branchName" text,
  "userId" uuid NOT NULL,
  date text,
  "timeslotId" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "appointment_reminder" (
  "appointmentId" uuid NOT NULL,
  "type" text NOT NULL,
  "requestedAt" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "appointment_reminder_type" (
  type text PRIMARY KEY NOT NULL,
  hours integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "telegram_verification" (
  "userId" uuid NOT NULL,
  "telegramUsername" text NOT NULL, 
  "verificationCode" uuid DEFAULT gen_random_uuid()
);

-- Database constraints
ALTER TABLE "branch_appointments"
  ADD CONSTRAINT "branch_appointments_appt_timeslots" FOREIGN KEY ("timeslotId") REFERENCES "public"."appointment_timeslots"("id") ON DELETE no action;
ALTER TABLE "branch_appointments"
  ADD CONSTRAINT "branch_appointments_user_userId" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action;
ALTER TABLE "appointment_reminder"
  ADD CONSTRAINT "appointment_reminder_appointment_id" FOREIGN KEY ("appointmentId") REFERENCES "public"."branch_appointments"("id") ON DELETE no action;
ALTER TABLE "appointment_reminder"
  ADD CONSTRAINT "appointment_reminder_reminder_type" FOREIGN KEY ("type") REFERENCES "public"."appointment_reminder_type"("type") ON DELETE no action;
ALTER TABLE "telegram_verification"
  ADD CONSTRAINT "telegram_verification_user_userId" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action;