
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const genders = ["Male", "Female", "Other"];

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    username: "",
    user_age: "",
    user_gender: "",
    user_description: "",
    email: "",
    user_prefernces: ""
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("user profile details")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) {
          setForm({
            username: data.username || "",
            user_age: data.user_age ? String(data.user_age) : "",
            user_gender: data.user_gender || "",
            user_description: data.user_description || "",
            email: data.email || user.email || "",
            user_prefernces: data.user_prefernces || ""
          });
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in!</h2>
        </div>
        <Footer />
      </div>
    )
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // upsert (insert or update) profile
    const { data, error } = await supabase
      .from("user profile details")
      .upsert({
        user_id: user.id,
        username: form.username,
        user_age: form.user_age ? parseInt(form.user_age) : null,
        user_gender: form.user_gender,
        user_description: form.user_description,
        email: form.email,
        user_prefernces: form.user_prefernces || null,
      }, { onConflict: "user_id" });
    setLoading(false);
    setEditing(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-8 pb-24">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <form className="max-w-xl mx-auto bg-movie-dark rounded-lg shadow p-6 space-y-6" onSubmit={handleSubmit}>
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
              readOnly
              className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white opacity-70"
              value={form.email}
              disabled
            />
          </div>

          <Button
            type="submit"
            className="bg-movie-primary hover:bg-movie-primary/90 w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
