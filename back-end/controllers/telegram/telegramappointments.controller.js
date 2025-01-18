import supabase from "../../utils/supabase.js";

const retrieveRemindersForTeleUser = async (req, res) => {
    try {
        const { telegramId } = req.params;
        if (!telegramId) {
            return res.status(400).json({ error: 'Telegram ID required in URL Parameters '})
        }

        const { data, error } = await supabase
            .from('telegram_verification')
            .select(`
                user!userId (
                    appointments:branch_appointments!userId (
                        *,
                        reminder:appointment_reminder!appointmentId (
                            *
                        ),
                        timeslot:appointment_timeslots!timeslotId (
                            timeslot
                        )  
                    )
                )
            `);

        if (error) {
            console.error(error);
            throw new Error(error.message);
        }

        const filteredData = data.filter(item => item.user.appointments.length > 0);
        res.status(200).json({
            status: 'success',
            data: filteredData[0].user.appointments
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default { retrieveRemindersForTeleUser };