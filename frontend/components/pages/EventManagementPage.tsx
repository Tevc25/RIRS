import React, { useState, useEffect } from 'react';
import type { Event, Guest, Contact, View, GuestStatus, EventManagementPageProps } from '../../types';
import { toast } from 'react-hot-toast';
import { List, Mail, BarChart3, Settings, ChevronLeft, LogOut, Trash2, Edit2, Send, Plus, Search, CheckCircle, Clock, XCircle, UserPlus, Download, Bell, User, Users, ChevronDown } from 'lucide-react';


const ContactFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (contact: Omit<Contact, 'id'> | Contact) => void;
    contactToEdit: Contact | null;
}> = ({ isOpen, onClose, onSave, contactToEdit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (contactToEdit) {
            setName(contactToEdit.name);
            setEmail(contactToEdit.email);
        } else {
            setName('');
            setEmail('');
        }
    }, [contactToEdit, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !email) {
            toast.error("Please fill out both name and email.");
            return;
        }
        onSave(contactToEdit ? { ...contactToEdit, name, email } : { name, email });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">{contactToEdit ? 'Edit Contact' : 'Add New Contact'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition" placeholder="John Doe" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition" placeholder="john.doe@example.com" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const GuestListTab: React.FC<{ guests: Guest[], onSendReminders: () => void }> = ({ guests, onSendReminders }) => {
    const [statusFilter, setStatusFilter] = useState<GuestStatus | 'All'>('All');
    
    const statusIconMap: Record<GuestStatus, React.ReactNode> = {
        'Confirmed': <CheckCircle className="w-5 h-5 text-green-500" />,
        'Pending': <Clock className="w-5 h-5 text-yellow-500" />,
        'Declined': <XCircle className="w-5 h-5 text-red-500" />,
        'Manually Added': <UserPlus className="w-5 h-5 text-blue-500" />
    };
    
    const filteredGuests = statusFilter === 'All' ? guests : guests.filter(g => g.status === statusFilter);

    const InputField: React.FC<{id: string, label: string, type?: string, icon: React.ReactNode, placeholder?: string}> = 
      ({id, label, type = "text", icon, placeholder}) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
                <input
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg shadow"><p className="text-2xl font-bold">{guests.length}</p><p className="text-sm text-gray-500">Total Guests</p></div>
                <div className="bg-white p-4 rounded-lg shadow"><p className="text-2xl font-bold text-green-600">{guests.filter(g=>g.status==='Confirmed').length}</p><p className="text-sm text-gray-500">Confirmed</p></div>
                <div className="bg-white p-4 rounded-lg shadow"><p className="text-2xl font-bold text-yellow-600">{guests.filter(g=>g.status==='Pending').length}</p><p className="text-sm text-gray-500">Pending</p></div>
                <div className="bg-white p-4 rounded-lg shadow"><p className="text-2xl font-bold text-red-600">{guests.filter(g=>g.status==='Declined').length}</p><p className="text-sm text-gray-500">Declined</p></div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                 <h3 className="text-lg font-semibold mb-4">Add New Guest</h3>
                 <form className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="md:col-span-1">
                      <InputField id="guest-name" label="Name" icon={<User className="w-5 h-5"/>} placeholder="John Doe"/>
                    </div>
                     <div className="md:col-span-1">
                       <InputField id="guest-email" label="Email" type="email" icon={<Mail className="w-5 h-5"/>} placeholder="john.doe@email.com"/>
                    </div>
                     <div className="md:col-span-1">
                        <InputField id="guest-party-size" label="Party Size" type="number" icon={<Users className="w-5 h-5"/>} placeholder="1"/>
                    </div>
                     <div className="md:col-span-1">
                        <button type="submit" className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center justify-center"><Plus className="w-4 h-4 mr-2"/>Add Guest</button>
                     </div>
                 </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-semibold">Guest List</h3>
                     <div className="flex items-center gap-4">
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                           <input type="text" placeholder="Search guests..." className="pl-9 w-full border border-gray-300 rounded-md shadow-sm text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition py-1.5"/>
                        </div>
                        <div className="relative">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as GuestStatus | 'All')} className="appearance-none w-full border border-gray-300 rounded-md shadow-sm text-sm bg-white text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition px-3 py-1.5">
                                <option value="All">All Statuses</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Declined">Declined</option>
                                <option value="Manually Added">Manually Added</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button onClick={onSendReminders} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 flex items-center text-sm font-medium"><Bell className="w-4 h-4 mr-2"/>Send Reminders</button>
                     </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Followers</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredGuests.map(guest => (
                          <tr key={guest.id}>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{guest.name}</div><div className="text-sm text-gray-500">{guest.email}</div></td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${guest.status === 'Confirmed' ? 'green' : guest.status === 'Pending' ? 'yellow' : 'red'}-100 text-${guest.status === 'Confirmed' ? 'green' : guest.status === 'Pending' ? 'yellow' : 'red'}-800`}>{guest.status}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{guest.followers}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"><button className="text-primary-600 hover:text-primary-900"><Edit2 className="w-4 h-4"/></button><button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4"/></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};


const InvitationsTab: React.FC<{ 
    contacts: Contact[], 
    onSendInvitations: () => void,
    onOpenModal: (contact: Contact | null) => void,
    onDeleteContact: (contactId: string) => void
}> = ({ contacts, onSendInvitations, onOpenModal, onDeleteContact }) => {
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

    const toggleContact = (contactId: string) => {
        setSelectedContacts(prev => prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Manage Contacts</h3>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search contacts..." className="pl-9 w-full border border-gray-300 rounded-md shadow-sm text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition py-1.5"/>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {contacts.map(contact => (
                        <div key={contact.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                            <div className="flex items-center">
                                <input
                                    id={`contact-${contact.id}`}
                                    type="checkbox"
                                    checked={selectedContacts.includes(contact.id)}
                                    onChange={() => toggleContact(contact.id)}
                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <label htmlFor={`contact-${contact.id}`} className="ml-3 block text-sm font-medium text-gray-700">{contact.name}<br/><span className="text-xs text-gray-500">{contact.email}</span></label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => onOpenModal(contact)} className="text-gray-400 hover:text-primary-600"><Edit2 className="w-4 h-4"/></button>
                                <button onClick={() => onDeleteContact(contact.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex space-x-2">
                     <button onClick={() => onOpenModal(null)} className="flex-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 text-sm font-medium">Add New</button>
                     <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 text-sm font-medium">Import</button>
                </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Compose Invitation</h3>
                    <p className="text-sm text-gray-500">Recipients Selected: {selectedContacts.length}</p>
                </div>
                <div className="space-y-4">
                    <input type="text" placeholder="Email Subject" defaultValue="Your Exclusive Event Invitation" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition"/>
                    <textarea rows={8} placeholder="Email Body" defaultValue={`Dear [Guest Name],\n\nWe are thrilled to invite you to our upcoming event, "[Event Name]".\n\nDate: [Event Date]\nTime: [Event Time]\nLocation: [Event Location]\n\nJoin us for an unforgettable experience!`} className="w-full p-3 border border-gray-300 rounded-md shadow-sm font-mono text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition"></textarea>
                    <input type="text" readOnly value="https://eventhost.com/register/your-event-id" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"/>
                    <div className="flex justify-end space-x-3">
                         <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm font-medium">Preview</button>
                         <button onClick={onSendInvitations} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center justify-center text-sm font-medium"><Send className="w-4 h-4 mr-2"/>Send Invitations</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReportsTab: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Event Performance</h3>
             <div className="flex justify-between items-center mb-4">
                 <p className="text-sm text-gray-600">Comprehensive insights into your event's reach and engagement.</p>
                 <button className="bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700 flex items-center text-sm font-medium"><Download className="w-4 h-4 mr-2"/>Download Report</button>
            </div>
            {/* Placeholder for charts */}
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Charts and analytics will be displayed here.</p>
            </div>
        </div>
    );
};


const EventManagementPage: React.FC<EventManagementPageProps> = ({ event, guests, contacts, onNavigate, onLogout, onAddContact, onUpdateContact, onDeleteContact }) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'invitations' | 'reports'>('guests');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const handleOpenModal = (contact: Contact | null) => {
      setContactToEdit(contact);
      setIsModalOpen(true);
  };
  
  const handleSaveContact = (contactData: Omit<Contact, 'id'> | Contact) => {
      if ('id' in contactData) {
          onUpdateContact(contactData);
      } else {
          onAddContact(contactData);
      }
  };

  const handleSendInvitations = () => {
      toast.success('Invitations sent successfully!');
  };
  
  const handleSendReminders = () => {
      toast.success('Reminders sent to all pending guests!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'guests': return <GuestListTab guests={guests} onSendReminders={handleSendReminders} />;
      case 'invitations': return <InvitationsTab contacts={contacts} onSendInvitations={handleSendInvitations} onOpenModal={handleOpenModal} onDeleteContact={onDeleteContact} />;
      case 'reports': return <ReportsTab />;
      default: return null;
    }
  };

  const TabButton: React.FC<{tabName: 'guests' | 'invitations' | 'reports', label: string, icon: React.ReactNode}> = ({tabName, label, icon}) => (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </button>
  );

  return (
     <div className="bg-gray-100 min-h-screen">
      <ContactFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveContact}
          contactToEdit={contactToEdit}
      />
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
           <div className="flex items-center space-x-4">
               <button onClick={() => onNavigate('DASHBOARD')} className="text-gray-500 hover:text-gray-700">
                   <ChevronLeft className="w-6 h-6"/>
               </button>
               <div>
                <h1 className="text-xl font-bold text-gray-900 truncate">{event.name}</h1>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
               </div>
           </div>
           <div className="flex items-center space-x-4">
                <button onClick={() => { onNavigate('EDIT_EVENT'); }} className="text-gray-500 hover:text-gray-700"><Settings className="w-5 h-5"/></button>
                <button onClick={onLogout} className="text-gray-500 hover:text-gray-700"><LogOut className="w-5 h-5"/></button>
           </div>
        </div>
      </header>
       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <div className="bg-white p-2 rounded-lg shadow-sm inline-flex space-x-2">
                <TabButton tabName="guests" label="Guest List" icon={<List className="w-5 h-5"/>}/>
                <TabButton tabName="invitations" label="Invitations" icon={<Mail className="w-5 h-5"/>}/>
                <TabButton tabName="reports" label="Reports" icon={<BarChart3 className="w-5 h-5"/>}/>
              </div>
            </div>
            <div>
              {renderTabContent()}
            </div>
       </main>
     </div>
  );
};

export default EventManagementPage;