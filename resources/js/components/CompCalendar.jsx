import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function CompCalendar({ events, setEvents, fetchEvents}) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [updateEvent, setUpdateEvent] = useState(false);

    useEffect(() => {
        if (updateEvent) {
            fetchEvents();
            setUpdateEvent(false);
        }
    }, [updateEvent]);

    const EventComponent = ({ event }) => {
        const start = moment(event.start).format('h:mm A');
        const end = moment(event.end).format('h:mm A');
        return (
            <span style={{fontSize: 12, fontWeight: 400}}>
                {/* {event.title} {event.allDay ? '' : ` (${start} - ${end})`} */}
                {event.title}
            </span>
        );
    };
    
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const closePopup = () => {
        setSelectedEvent(null);
    }
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const handleSaveEvent = async () => {
        if (selectedEvent) {
            const response = await fetch('/update-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    calendarId: 'primary',
                    eventId: selectedEvent.eventId,
                    title: selectedEvent.title,
                    description: selectedEvent.description,
                    start: selectedEvent.start,
                    end: selectedEvent.end,
                }),
            });
    
            const data = await response.json();
            setSelectedEvent(null);
            if (response.ok) {
                // Update events state with the updated event
                setUpdateEvent(true);
                setEvents(events.map(event => event.id === data.event.id ? data.event : event));
            } else {
                // Handle error
                console.error(data.message);
            }
        }
    };

    const handleDeleteEvent = async () => {
        const response = await fetch('/delete-event', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                calendarId: 'primary',
                eventId: selectedEvent.eventId,
            }),
        });
    
        if (response.ok) {
            // Remove deleted event from events state
            // setEvents(events.filter(e => e.eventId !== event.eventId));
            setSelectedEvent(null);
            fetchEvents();
        } else {
            // Handle error
            const data = await response.json();
            console.error(data.message);
        }
    };
    console.log('select',selectedEvent);
    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                components={{
                    event: EventComponent
                }}
                onSelectEvent={handleSelectEvent}
                onDoubleClickEvent={handleDeleteEvent}
                onSelectSlot={(slotInfo) => {
                    setSelectedEvent({
                        start: slotInfo.start,
                        end: slotInfo.end,
                        title: '',
                        allDay: slotInfo.slots.length === 1,
                    });
                }}
            />
             {selectedEvent && (
                <div className="popup-form">
                    <div className='header' style={{display : "flex"}}>
                    <h2>{'Edit Event'}</h2>
                    <button className="close-popup" onClick={closePopup}>×</button>
                    </div>
                    <input
                        type="text"
                        value={selectedEvent.title}
                        onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                    />
                    <textarea
                        value={selectedEvent.description}
                        onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                    />
                    <button onClick={ handleSaveEvent} class="btn btn-success">
                        { 'Save'}
                    </button>
                    {selectedEvent.eventId && <button class="btn btn-danger" onClick={handleDeleteEvent}>Delete</button>}
                </div>
            )}

        </div>
        
    );
}

export default CompCalendar;