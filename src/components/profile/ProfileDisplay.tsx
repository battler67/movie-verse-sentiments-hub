
import React from 'react';
import { preferences } from '@/constants/profileConstants';

interface ProfileDisplayProps {
  username: string;
  email: string;
  age: string | number;
  gender: string;
  preferences: string;
  description: string;
}

const ProfileDisplay = ({ username, email, age, gender, preferences: userPreferences, description }: ProfileDisplayProps) => {
  return (
    <div className="max-w-xl mx-auto mb-8 bg-movie-dark border border-movie-primary rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-3">Your Profile Details</h2>
      <div className="space-y-2">
        <div>
          <span className="font-semibold text-movie-primary">Username: </span>
          <span>{username}</span>
        </div>
        <div>
          <span className="font-semibold text-movie-primary">Email: </span>
          <span>{email}</span>
        </div>
        <div>
          <span className="font-semibold text-movie-primary">Age: </span>
          <span>{age}</span>
        </div>
        <div>
          <span className="font-semibold text-movie-primary">Gender: </span>
          <span>{gender}</span>
        </div>
        <div>
          <span className="font-semibold text-movie-primary">Preferences: </span>
          <span>{preferences.find(p => p.value === userPreferences)?.label ?? "All genres"}</span>
        </div>
        <div>
          <span className="font-semibold text-movie-primary">Description: </span>
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
