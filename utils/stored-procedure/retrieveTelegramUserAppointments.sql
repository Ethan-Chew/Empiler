CREATE OR REPLACE FUNCTION retrieve_telegram_user_reminders("teleId" TEXT)
RETURNS JSONB AS $$
DECLARE
  current_record RECORD;
BEGIN
  SELECT jsonb_agg(
           jsonb_build_object(
             'appointmentId', branch_appointments.id,
             'branchName', branch_appointments."branchName",
             'appointmentDate', branch_appointments.date,
             'appointmentTime', appointment_timeslots.timeslot,
             'reminderTime', appointment_reminder."reminderTime"
           )
         )
  INTO current_record
  FROM "telegram_verification"
  LEFT JOIN "branch_appointments" ON "branch_appointments"."userId" = "telegram_verification"."userId"
  LEFT JOIN "appointment_reminder" ON "appointment_reminder"."appointmentId" = "branch_appointments".id
  LEFT JOIN "appointment_timeslots" ON "appointment_reminder"."reminderTime" = "appointment_timeslots".id
  WHERE "telegramId" = "teleId"::UUID;

  IF current_record IS NULL OR current_record = '[]'::JSONB THEN
    RETURN jsonb_build_object(
      'status', 'error',
      'message', 'Telegram Account not Linked.'
    );
  END IF;

  RETURN jsonb_build_object(
    'status', 'success',
    'data', current_record
  );
END;
$$ language plpgsql;