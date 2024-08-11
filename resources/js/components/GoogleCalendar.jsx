import React, { useEffect, useState } from 'react';
// import "./components/css/app.css";
import Sidebar from './Sidebar';
import EventList from './EventList';
import CompCalendar from './CompCalendar';

const GoogleCalendar = () => {
    const [events, setEvents] = useState([]);

    const fetchEvents = () => {
        axios.get('/events?calendarId=primary')
            .then(response => {
                const fetchedEvents = response.data.events.map(event => {
                    const allDay = event.start.date ? true : false;
                    let end = null;

                    if (allDay) {
                        end = new Date(event.end.date);
                        end.setDate(end.getDate() - 1);
                    } else {
                        end = new Date(event.end.dateTime);
                    }

                    return {
                        eventId: event.id,
                        title: event.summary,
                        start: new Date(allDay ? event.start.date : event.start.dateTime),
                        end: end,
                        allDay: allDay,
                    };
                });

                setEvents(fetchedEvents);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="app-container">
            <Sidebar fetchEvents={fetchEvents}/>
            <div className="main-content">
                <CompCalendar events={events} setEvents={setEvents} fetchEvents={fetchEvents}/>
            </div>
        </div>
    );
};

export default GoogleCalendar;