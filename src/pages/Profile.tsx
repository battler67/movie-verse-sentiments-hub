
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [profileSaved, setProfileSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const profileBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          // Convert the string ID to a number for Supabase query
          // This is a workaround as the database expects a number but auth provides a string UUID
          const numericId = Number(user.id);
          
          if (isNaN(numericId)) {
            // Handle the case where user.id is not a valid number
            console.error("Invalid user ID format:", user.id);
            toast.error("Invalid user ID format");
            setLoading(false);
            return;
          }
          
          const { data, error } = await supabase
            .from("user profile details")
            .select("*")
            .eq("user_id", numericId)
            .maybeSingle();
          
          if (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile");
          }
          
          if (data) {
            setForm({
              username: data.username || "",
              user_age: data.user_age ? String(data.user_age) : "",
              user_gender: data.user_gender || "",
              user_description: data.user_description || "",
              email: data.email || user.email || "",
              user_prefernces: data.user_prefernces || ""
            });
            // If profile exists, consider it saved for display purposes
            setProfileSaved(true);
          }
        } catch (error) {
          console.error("Error in fetchProfile:", error);
          toast.error("An unexpected error occurred while loading profile");
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Handle hash navigation
  useEffect(() => {
    // Check if there's a hash in the URL that targets the profile box
    if (window.location.hash === '#user-profile-box' && profileBoxRef.current) {
      profileBoxRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [profileSaved]);

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in!</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProfileSaved(false);
    try {
      // Convert the string ID to a number for Supabase upsert
      const numericId = Number(user.id);
      
      if (isNaN(numericId)) {
        toast.error("Invalid user ID format");
        setLoading(false);
        return;
      }
      
      // upsert (insert or update) profile, ensure all types match Supabase requirements
      const { error } = await supabase
        .from("user profile details")
        .upsert({
          user_id: numericId,
          username: form.username,
          user_age: form.user_age ? Number(form.user_age) : null,
          user_gender: form.user_gender,
          user_description: form.user_description,
          email: form.email,
          user_prefernces: form.user_prefernces || null,
        }, { onConflict: "user_id" });
      
      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to save profile");
      } else {
        toast.success("Profile saved successfully");
        setProfileSaved(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-8 pb-24">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        {/* Profile saved box */}
        {profileSaved && (
          <div
            id="user-profile-box"
            ref={profileBoxRef}
            className="max-w-xl mx-auto mb-8 bg-movie-dark border border-movie-primary rounded-lg shadow p-6"
          >
            <h2 className="text-2xl font-semibold mb-4">Your Profile Details</h2>
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-movie-primary">Username: </span>
                <span>{form.username}</span>
              </div>
              <div>
                <span className="font-semibold text-movie-primary">Email: </span>
                <span>{form.email}</span>
              </div>
              <div>
                <span className="font-semibold text-movie-primary">Age: </span>
                <span>{form.user_age}</span>
              </div>
              <div>
                <span className="font-semibold text-movie-primary">Gender: </span>
                <span>{form.user_gender}</span>
              </div>
              <div>
                <span className="font-semibold text-movie-primary">Description: </span>
                <span>{form.user_description}</span>
              </div>
            </div>
          </div>
        )}

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
              className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white"
              value={form.email}
              onChange={onChange}
              required
              disabled={loading}
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
