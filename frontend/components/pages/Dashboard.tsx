import React, { useState, useMemo } from 'react';
import type { Event, View } from '../../types';
import { Plus, Search, LogOut, Compass, List, Edit2, Settings, Calendar, MapPin, Lock, ArrowUpDown, ChevronDown } from 'lucide-react';

interface DashboardProps {
  events: Event[];
  userId: string;
  onNavigate: (view: View) => void;
  onSelectEvent: (eventId: string) => void;
  onLogout: () => void;
}

const EventCard: React.FC<{ event: Event; onSelect: () => void; onManage?: () => void; onEdit?: () => void; }> = ({ event, onSelect, onManage, onEdit }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col">
            <div className="relative">
                <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">{event.category}</div>
                {event.isPrivate && <div className="absolute top-2 left-2 bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-full">Private</div>}
            </div>
            <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{event.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                    <span className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>{event.location}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden text-ellipsis flex-grow">{event.description}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <button onClick={onSelect} className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">View Details →</button>
                    {onManage && onEdit && (
                         <div className="flex items-center space-x-2">
                             <button onClick={onEdit} title="Edit Event" className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"><Edit2 className="w-4 h-4"/></button>
                             <button onClick={onManage} title="Manage Event" className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"><Settings className="w-4 h-4"/></button>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FilterInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }> = ({ icon, ...props }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
        <input {...props} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm font-medium transition"/>
    </div>
);

const FilterSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { icon: React.ReactNode }> = ({ icon, children, ...props }) => (
     <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
        <select {...props} className="w-full appearance-none pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm font-medium transition">
            {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ events, userId, onNavigate, onSelectEvent, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'myEvents'>('discover');
  const [filters, setFilters] = useState({ name: '', isPrivate: 'all', date: '', location: '' });
  const [sortBy, setSortBy] = useState('date');

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const filteredAndSortedEvents = useMemo(() => {
    let eventsToShow = activeTab === 'discover' 
        ? events.filter(e => !e.isPrivate)
        : events.filter(e => e.creatorId === userId);
    
    eventsToShow = eventsToShow.filter(e => 
      e.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (activeTab === 'discover' || filters.isPrivate === 'all' || String(e.isPrivate) === filters.isPrivate) &&
      (filters.location === '' || e.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.date === '' || e.date >= filters.date)
    );

    eventsToShow.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return eventsToShow;

  }, [events, activeTab, userId, filters, sortBy]);

  const TabButton: React.FC<{tabName: 'discover' | 'myEvents', label: string, icon: React.ReactNode}> = ({tabName, label, icon}) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === tabName ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
       <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">EventSphere</h1>
          </div>
          <div className="flex items-center space-x-4">
              <button onClick={onLogout} className="text-gray-500 hover:text-gray-700">
                  <LogOut className="w-6 h-6"/>
              </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative bg-primary-700 rounded-lg p-8 md:p-12 mb-12 text-white overflow-hidden" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)'}}>
            <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Your Next Event Awaits</h2>
                <p className="mt-4 text-lg md:text-xl text-primary-200 max-w-2xl mx-auto">Bring your vision to life. Create, manage, and share your events with the world, all in one place.</p>
                <button
                    onClick={() => onNavigate('CREATE_EVENT')}
                    className="mt-8 inline-flex items-center justify-center bg-white text-primary-600 font-bold px-8 py-3 rounded-full hover:bg-primary-50 transition-transform transform hover:scale-105"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create an Event
                </button>
            </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 sticky top-[72px] z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="bg-gray-100 p-1 rounded-full inline-flex space-x-1">
                    <TabButton tabName="discover" label="Discover Events" icon={<Compass className="w-5 h-5"/>}/>
                    <TabButton tabName="myEvents" label="My Events" icon={<List className="w-5 h-5"/>}/>
                </div>
                <div className="flex items-center gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" name="name" value={filters.name} onChange={handleFilterChange} placeholder="Search..." className="w-full text-sm pl-9 pr-3 py-1.5 border border-gray-300 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"/>
                   </div>
                </div>
            </div>
             <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <FilterInput icon={<Calendar className="w-5 h-5"/>} type="date" name="date" value={filters.date} onChange={handleFilterChange} />
                  <FilterInput icon={<MapPin className="w-5 h-5"/>} type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location" />
                  {activeTab === 'myEvents' ? (
                      <FilterSelect icon={<Lock className="w-5 h-5"/>} name="isPrivate" value={filters.isPrivate} onChange={handleFilterChange}>
                          <option value="all">All (Public/Private)</option>
                          <option value="false">Public</option>
                          <option value="true">Private</option>
                      </FilterSelect>
                  ) : <div className="hidden sm:block"></div>}
                  <FilterSelect icon={<ArrowUpDown className="w-5 h-5"/>} name="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="date">Sort by Date</option>
                      <option value="name">Sort by Name</option>
                  </FilterSelect>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedEvents.length > 0 ? filteredAndSortedEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onSelect={() => {
                  onSelectEvent(event.id);
                  onNavigate('EVENT_DETAILS');
              }}
              {...(activeTab === 'myEvents' && {
                  onManage: () => {
                      onSelectEvent(event.id);
                      onNavigate('MANAGE_EVENT');
                  },
                  onEdit: () => {
                      onSelectEvent(event.id);
                      onNavigate('EDIT_EVENT');
                  }
              })}
            />
          )) : (
              <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-700">No Events Found</h3>
                  <p className="text-gray-500 mt-2">{activeTab === 'myEvents' ? 'Try adjusting your filters or create a new event!' : 'It looks like there are no public events matching your search.'}</p>
              </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default Dashboard;