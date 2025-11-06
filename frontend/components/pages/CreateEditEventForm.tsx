import React, { useState } from 'react';
import type { Event } from '../../types';
import { Calendar, Clock, MapPin, Users, Upload, Lock, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CreateEditEventFormProps {
  eventToEdit?: Event;
  // FIX: Update onSave prop to accept event data for creation, which excludes id and creatorId.
  onSave: (event: Event | Omit<Event, 'id' | 'creatorId'>) => void;
  onCancel: () => void;
}

const CreateEditEventForm: React.FC<CreateEditEventFormProps> = ({ eventToEdit, onSave, onCancel }) => {
  const [eventData, setEventData] = useState({
    name: eventToEdit?.name || '',
    description: eventToEdit?.description || '',
    date: eventToEdit?.date || '',
    time: eventToEdit?.time || '',
    location: eventToEdit?.location || '',
    maxCapacity: eventToEdit?.maxCapacity || 50,
    isPrivate: eventToEdit?.isPrivate || false,
    image: eventToEdit?.image || 'https://picsum.photos/seed/event/1200/800',
    registrationDeadline: eventToEdit?.registrationDeadline || '',
    category: eventToEdit?.category || 'Technology',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setEventData(prev => ({...prev, [name]: checked }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventData.name || !eventData.date || !eventData.time || !eventData.location || !eventData.description) {
        toast.error("Please fill in all mandatory fields.");
        return;
    }
    
    if (eventToEdit) {
      onSave({ ...eventToEdit, ...eventData });
    } else {
      onSave(eventData);
    }
  };
  
  const InputField: React.FC<{id: string, label: string, type?: string, value: string | number, name: string, onChange: any, icon: React.ReactNode, placeholder?: string}> = 
  ({id, label, type = "text", value, name, onChange, icon, placeholder}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition"
            />
        </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            {eventToEdit ? 'Edit Your Event' : 'Create a New Event'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Fill out the details below to set up your next memorable event.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-6">
             <div>
                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                 <input id="name" name="name" type="text" value={eventData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition" placeholder="e.g., Annual Tech Summit" />
            </div>
            
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
                <textarea id="description" name="description" value={eventData.description} onChange={handleChange} rows={4} required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition" placeholder="Provide a detailed description of your event..."></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="date" name="date" label="Date" type="date" value={eventData.date} onChange={handleChange} icon={<Calendar className="w-5 h-5" />} />
                <InputField id="time" name="time" label="Time" type="time" value={eventData.time} onChange={handleChange} icon={<Clock className="w-5 h-5" />} />
            </div>

            <InputField id="location" name="location" label="Location" value={eventData.location} onChange={handleChange} icon={<MapPin className="w-5 h-5" />} placeholder="e.g., Conference Center, Online (Zoom Link)" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="maxCapacity" name="maxCapacity" label="Max Capacity" type="number" value={eventData.maxCapacity} onChange={handleChange} icon={<Users className="w-5 h-5" />} />
                <InputField id="registrationDeadline" name="registrationDeadline" label="Registration Deadline" type="datetime-local" value={eventData.registrationDeadline} onChange={handleChange} icon={<Calendar className="w-5 h-5" />} />
            </div>
            
            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

             <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isPrivate"
                  name="isPrivate"
                  type="checkbox"
                  checked={eventData.isPrivate}
                  onChange={handleCheckboxChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isPrivate" className="font-medium text-gray-700 flex items-center">
                    {eventData.isPrivate ? <Lock className="w-4 h-4 mr-2"/> : <Globe className="w-4 h-4 mr-2"/>}
                    Make this event private (only accessible via direct link)
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {eventToEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditEventForm;