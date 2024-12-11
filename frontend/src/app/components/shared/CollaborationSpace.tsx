"use client"
import React, { useState } from 'react';
import { 
  UserPlusIcon, 
  UserIcon, 
  XCircleIcon, 
  MailIcon 
} from 'lucide-react';

export default function CollaborationSpace() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'John Doe', role: 'Editor', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=John' },
    { id: 2, name: 'Jane Smith', role: 'Viewer', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Jane' }
  ]);

  const handleInvite = () => {
    if (inviteEmail) {
      const newCollaborator = {
        id: Date.now(),
        name: inviteEmail.split('@')[0],
        role: 'Viewer',
        avatar: `https://api.dicebear.com/8.x/avataaars/svg?seed=${inviteEmail}`
      };
      
      setCollaborators([...collaborators, newCollaborator]);
      setInviteEmail('');
    }
  };

  const removeCollaborator = (id:any) => {
    setCollaborators(collaborators.filter(collab => collab.id !== id));
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <UserPlusIcon className="w-8 h-8 text-green-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Collaboration Space</h2>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-4 text-gray-700 flex items-center">
          <UserIcon className="w-5 h-5 mr-2 text-gray-500" />
          Current Collaborators ({collaborators.length})
        </h3>
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="flex justify-between items-center border-b py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200"
          >
            <div className="flex items-center">
              <img 
                src={collaborator.avatar} 
                alt={collaborator.name} 
                className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200"
              />
              <div>
                <span className="font-medium text-gray-800">{collaborator.name}</span>
                <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {collaborator.role}
                </span>
              </div>
            </div>
            <button 
              onClick={() => removeCollaborator(collaborator.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex">
        <div className="relative flex-grow mr-2">
          <input
            type="email"
            placeholder="Invite by email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:ring-green-300 transition-all"
          />
          <MailIcon className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={handleInvite}
          disabled={!inviteEmail}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center"
        >
          <UserPlusIcon className="mr-2" />
          Invite
        </button>
      </div>
    </div>
  );
}