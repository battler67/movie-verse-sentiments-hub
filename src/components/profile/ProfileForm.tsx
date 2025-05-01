
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { genders, preferences } from '@/constants/profileConstants';

interface ProfileFormData {
  username: string;
  user_age: string;
  user_gender: string;
  user_description: string;
  email: string;
  user_preferences: string;
}

interface ProfileFormProps {
  form: ProfileFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const ProfileForm = ({ form, onChange, onSubmit, loading }: ProfileFormProps) => {
  return (
    <form className="max-w-xl mx-auto bg-movie-dark rounded-lg shadow p-6 space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white"
          value={form.username}
          onChange={onChange}
          required
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="user_age">Age</Label>
        <Input
          id="user_age"
          type="number"
          name="user_age"
          className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white"
          value={form.user_age}
          onChange={onChange}
          min={10}
          max={100}
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="user_gender">Gender</Label>
        <select
          id="user_gender"
          name="user_gender"
          className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white"
          value={form.user_gender}
          onChange={onChange}
          disabled={loading}
        >
          <option value="">Select Gender</option>
          {genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="user_preferences">Preferences</Label>
        <select
          id="user_preferences"
          name="user_preferences"
          className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white"
          value={form.user_preferences}
          onChange={onChange}
          disabled={loading}
        >
          {preferences.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="user_description">Description</Label>
        <Textarea
          id="user_description"
          name="user_description"
          className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white"
          rows={3}
          value={form.user_description}
          onChange={onChange}
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white cursor-not-allowed"
          value={form.email}
          readOnly
          disabled
        />
      </div>
      
      <Button type="submit" className="bg-movie-primary hover:bg-movie-primary/90 w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
};

export default ProfileForm;
