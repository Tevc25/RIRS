import React from 'react';
import type { Event } from '../../types';
import { User, Mail, Users, MessageSquare, Utensils } from 'lucide-react';

interface RegistrationFormProps {
  event: Event;
  onSubmit: () => void;
  onCancel: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ event, onSubmit, onCancel }) => {
    const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'None'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
            <img src="https://picsum.photos/seed/logo/100/100" alt="Event Logo" className="mx-auto h-16 w-16 rounded-full mb-4"/>
            <h2 className="text-2xl font-bold text-gray-900">Event Registration</h2>
            <p className="mt-2 text-lg font-semibold text-primary-600">{event.name}</p>
            <p className="mt-1 text-sm text-gray-600">Join us for a day of fun, food, and festivities! Please confirm your attendance and preferences below.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <InputField id="full-name" label="Full Name" icon={<User className="w-5 h-5"/>} placeholder="John Doe"/>
                <InputField id="email" label="Email Address" type="email" icon={<Mail className="w-5 h-5"/>} placeholder="john.doe@example.com"/>
                <InputField id="companions" label="Number of Companions" type="number" icon={<Users className="w-5 h-5"/>} placeholder="0"/>
                
                <div>
                     <label htmlFor="personal-message" className="block text-sm font-medium text-gray-700 mb-1">Personal Message (Optional)</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-primary-300"/>
                        <textarea id="personal-message" rows={3} className="w-full pl-10 pr-4 py-2 border-transparent rounded-md bg-primary-600 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 transition" placeholder="Any special notes for the organizer?"></textarea>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center"><Utensils className="w-5 h-5 mr-2 text-gray-400"/>Dietary Restrictions</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {dietaryOptions.map(option => (
                            <div key={option} className="flex items-center">
                                <input id={option} name="diet" type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"/>
                                <label htmlFor={option} className="ml-2 block text-sm text-gray-900">{option}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col space-y-3 pt-4">
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Confirm Registration
                </button>
                 <button type="button" onClick={onCancel} className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                  Go Back
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

const InputField: React.FC<{id: string, label: string, type?: string, icon: React.ReactNode, placeholder?: string}> = 
  ({id, label, type = "text", icon, placeholder}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-300">{icon}</span>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border-transparent rounded-md bg-primary-600 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
            />
        </div>
    </div>
);


export default RegistrationForm;
