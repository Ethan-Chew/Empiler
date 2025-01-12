CREATE OR REPLACE FUNCTION validate_telegram_user(code TEXT, "teleId" TEXT, "teleUsername" TEXT)
RETURNS TEXT AS $$
DECLARE
  current_record RECORD;
BEGIN
  SELECT * INTO current_record
  FROM telegram_verification
  WHERE "verificationCode" = code::UUID;

  IF current_record IS NULL THEN
    RETURN 'Invalid Verification Code.';
  END IF;

  IF current_record."telegramUsername" != "teleUsername" IS NULL THEN
    RETURN 'Telegram Username Mismatch. Ensure that you are using the correct Telegram Account.';
  END IF;

  UPDATE telegram_verification
  SET verified = TRUE, "telegramId" = "teleId"
  WHERE "verificationCode" = code::UUID;

  RETURN 'Success';
END;
$$ language plpgsql;