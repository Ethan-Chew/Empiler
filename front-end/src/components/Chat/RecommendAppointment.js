import React from 'react';
import { BsCalendarCheck } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

export default function AppointmentRecommendation() {
    const navigate = useNavigate();
    const displayReccoAppt = true; // Assuming this is a state or prop

    return (
        <div className="appointment flex-grow overflow-hidden flex items-center justify-center">
            <div className="flex flex-col items-center justify-center p-10 bg-white drop-shadow-[0_0px_4px_rgba(0,0,0,.15)] rounded">
                <p className='font-semibold mb-3'>We're sorry that your issue couldn't be solved. Consider making an appointment instead?</p>
                <button
                    className='w-full py-2 px-4 flex flex-row rounded-xl bg-white drop-shadow-[0_0px_3px_rgba(0,0,0,.15)] items-center gap-3 text-ocbcred hover:text-ocbcdarkred'
                    onClick={() => navigate('/appointments/branches')}
                >
                    <div className='w-10 h-10 rounded-full bg-ocbcred/10 flex justify-center items-center'>
                        <BsCalendarCheck className='text-xl' />
                    </div>
                    <p className='text-lg font-medium'>Make an Appointment</p>
                </button>
            </div>
        </div>
    );
}