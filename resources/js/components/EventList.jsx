import React from 'react';

const EventList = ({ events }) => {
    return (
        <div>
            <h2>Existing Events</h2>
            {events.map(event => (
                <div key={event.id}>
                    <h3>{event.summary}</h3>
                    <p>{event.description}</p>
                    <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
};

export default EventList;