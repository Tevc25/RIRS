import React from 'react';
import type { Event } from '../../types';
import { Star, MessageCircle } from 'lucide-react';

interface FeedbackFormProps {
  event: Event;
  onSubmit: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ event, onSubmit }) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    }

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">We'd Love Your Feedback!</h2>
                    <p className="mt-2 text-md text-gray-600">Thank you for attending <span className="font-semibold text-primary-600">{event.name}</span>. Your feedback helps us make future events even better.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Overall Experience</h3>
                            <RatingGroup name="overall"/>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Venue & Atmosphere</h3>
                             <RadioGroup name="venue" options={['Excellent', 'Good', 'Fair', 'Poor']} />
                        </div>
                         <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Event Organization</h3>
                             <RadioGroup name="organization" options={['Excellent', 'Good', 'Fair', 'Poor']} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Speakers / Content Quality</h3>
                             <RadioGroup name="content" options={['Excellent', 'Good', 'Fair', 'Poor']} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-md font-semibold text-gray-800 mb-2">Personal Comment / Suggestion</label>
                        <div className="relative">
                           <MessageCircle className="absolute left-3 top-3 w-5 h-5 text-primary-300"/>
                           <textarea id="comment" rows={4} className="w-full pl-10 pr-4 py-2 border-transparent rounded-md bg-primary-600 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 transition" placeholder="What did you like? What could be improved?"></textarea>
                        </div>
                    </div>

                     <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Send Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

const RatingGroup: React.FC<{name: string}> = ({name}) => {
    const [rating, setRating] = React.useState(0);
    return (
        <div className="flex space-x-1">
        {[1,2,3,4,5].map(star => (
            <label key={star}>
                <input type="radio" name={name} value={star} className="sr-only" onClick={() => setRating(star)} />
                <Star className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            </label>
        ))}
        </div>
    )
}

const RadioGroup: React.FC<{name: string, options: string[]}> = ({name, options}) => (
    <div className="space-y-2">
        {options.map(option => (
            <div key={option} className="flex items-center">
                <input id={`${name}-${option}`} name={name} type="radio" className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"/>
                <label htmlFor={`${name}-${option}`} className="ml-3 block text-sm font-medium text-gray-700">{option}</label>
            </div>
        ))}
    </div>
);


export default FeedbackForm;
