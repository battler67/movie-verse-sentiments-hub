
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="max-w-xl mx-auto mb-8 bg-movie-dark border border-movie-primary">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-2xl font-semibold">Your Profile Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
          <span className="font-semibold text-movie-primary">Username:</span>
          <span>{username}</span>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
          <span className="font-semibold text-movie-primary">Email:</span>
          <span>{email}</span>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
          <span className="font-semibold text-movie-primary">Age:</span>
          <span>{age || 'Not specified'}</span>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
          <span className="font-semibold text-movie-primary">Gender:</span>
          <span>{gender || 'Not specified'}</span>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
          <span className="font-semibold text-movie-primary">Preferences:</span>
          <span>{preferences.find(p => p.value === userPreferences)?.label ?? "All genres"}</span>
        </div>
        
        <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
          <span className="font-semibold text-movie-primary">Description:</span>
          <span>{description || 'No description provided'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDisplay;
