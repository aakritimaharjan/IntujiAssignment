import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import MyDatePicker from './MyDatePicker';
// import './EditEventModal.css';

const EditEventModal = ({ open, handleClose, event, setEvent, handleSave, handleDelete }) => {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{event.id ? 'Edit Event' : 'Create Event'}</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                <div className="modal-body">
                    <label>Title</label>
                    <input
                        type="text"
                        placeholder="Title"
                        value={event.title}
                        onChange={(e) => setEvent({ ...event, title: e.target.value })}
                    />
                    <label>Description</label>
                    <textarea
                        placeholder="Description"
                        value={event.description}
                        onChange={(e) => setEvent({ ...event, description: e.target.value })}
                    ></textarea>
                    <label>Start Date</label>
                    <MyDatePicker
                        selectedDate={event.start ? new Date(event.start) : null}
                        onChange={(date) => setEvent({ ...event, start: date.toISOString() })}
                    />
                    <label>End Date</label>
                    <MyDatePicker
                        selectedDate={event.end ? new Date(event.end) : null}
                        onChange={(date) => setEvent({ ...event, end: date.toISOString() })}
                    />
                </div>
                <div className="modal-footer">
                    {event.id && (
                        <button className="delete-button" onClick={() => handleDelete(event.id)}>Delete</button>
                    )}
                    <button className="save-button" onClick={handleSave}>
                        {event.id ? 'Save' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditEventModal;