import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MyDatePicker = ({ label, selectedDate, onChange }) => {
    const [startDate, setStartDate] = useState(selectedDate);

    return (
        <div>
            <label>{label}</label>
            <DatePicker
                selected={startDate}
                onChange={(date) => {
                    setStartDate(date);
                    onChange(date);
                }}
                dateFormat="MMMM d, yyyy"
            />
        </div>
    );
};

export default MyDatePicker;