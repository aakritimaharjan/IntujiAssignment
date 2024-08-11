import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditEventModal from './EditEventModal';

const Sidebar = ({fetchEvents}) => {
    const [calendars, setCalendars] = useState([]);
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    useEffect(() => {
        axios.get('/filters').then(response => {
            setCalendars(response.data.calendars);
            }).catch(error => {
                console.error('Error fetching filters:', error);
            });
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleCreateEvent = () => {
        setSelectedEvent({ title: '', description: '', start: new Date(), end: new Date() });
        setIsModalOpen(true);
    };

    const handleAddEvent = async () => {
        if (selectedEvent.id) {
            // Update event logic here (e.g., call to your API)
        } else {
            // Create event
            const response = await fetch('/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(selectedEvent),
            });

            const newEvent = await response.json();
            fetchEvents();
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="sidebar">
                <button className="add-event-btn" onClick={() => {
                    handleCreateEvent();
                    setIsModalOpen(true);
                }}>
                    Add New
                </button>
                <button
                    className="authorize-event-btn"
                    onClick={() => {
                        window.location.href = "/auth/google";
                    }}
                    >
                    Authorize First
                </button>
                <div className="filters">
                    <p>Filter</p>
                    {calendars.map((calendar) => (
                        <label key={(calendar).id}>
                            <input type="checkbox"/> {(calendar).summary}
                        </label>
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <EditEventModal
                    open={isModalOpen}
                    handleClose={() => setIsModalOpen(false)}
                    event={selectedEvent}
                    setEvent={setSelectedEvent}
                    handleSave={handleAddEvent}
                    handleDelete={null} // Add delete logic here if needed
                />
            )}
        </>
        
    );
};

export default Sidebar;