CREATE OR REPLACE FUNCTION validate_telegram_user(code TEXT, "teleId" TEXT, "teleUsername" TEXT, "currentUnixMs" INTEGER)
RETURNS TEXT AS $$
DECLARE
  current_record RECORD;
BEGIN
  SELECT * INTO current_record
  FROM telegram_verification
  WHERE "telegramUsername" = "teleUsername";

  IF current_record IS NULL THEN
    RETURN 'This Telegram Account is not linked to an OCBC Support Account. Please check your Telegram Username on the OCBC Support Portal.';
  END IF;

  IF current_record."telegramId" IS NOT NULL THEN
    RETURN 'This Telegram Account has already been linked.';
  END IF;

  IF current_record."verificationCode" != code::UUID THEN
    RETURN 'Invalid Verification Code';
  END IF;

  IF current_record."telegramUsername" != "teleUsername" IS NULL THEN
    RETURN 'Telegram Username Mismatch. Ensure that you are using the correct Telegram Account.';
  END IF;

  UPDATE telegram_verification
  SET verified = TRUE, "telegramId" = "teleId"::INTEGER, "verifiedDate" = "currentUnixMs"
  WHERE "verificationCode" = code::UUID;

  RETURN 'Success';
END;
$$ language plpgsql;