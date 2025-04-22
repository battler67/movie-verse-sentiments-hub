
import React from 'react';
import { Button } from '@/components/ui/button';
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
      <div>
        <label className="block font-semibold mb-1">Username</label>
        <input
          type="text"
          name="username"
          className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white"
          value={form.username}
          onChange={onChange}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Age</label>
        <input
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
      <div>
        <label className="block font-semibold mb-1">Gender</label>
        <select
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
      <div>
        <label className="block font-semibold mb-1">Preferences</label>
        <select
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
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          name="user_description"
          className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white"
          rows={3}
          value={form.user_description}
          onChange={onChange}
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white"
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
