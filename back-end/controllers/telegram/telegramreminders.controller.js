const retrieveRemindersForTeleUser = async (req, res) => {
    try {
        const { telegramId } = req.params;
        if (!telegramId) {
            return res.status(400).json({ error: 'Telegram ID required in URL Parameters '})
        }

        // const userReminders
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}