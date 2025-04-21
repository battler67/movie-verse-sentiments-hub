
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const genders = ["Male", "Female", "Other"];
const preferences = [
  { value: "all", label: "All genres" },
  { value: "action", label: "Action" },
  { value: "romantic", label: "Romantic" },
  { value: "comedy", label: "Comedy" },
  { value: "drama", label: "Drama" },
  { value: "horror", label: "Horror" }
];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    user_age: "",
    user_gender: "",
    user_description: "",
    email: "",
    user_prefernces: "all"
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const profileBoxRef = useRef<HTMLDivElement>(null);

  // LOAD EXISTING PROFILE BY EMAIL (since user_id has been removed)
  useEffect(() => {
    if (user?.email) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("user profile details")
            .select("*")
            .eq("email", user.email)
            .maybeSingle();

          if (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile");
          }
          if (data) {
            setForm({
              username: data.username || "",
              user_age: data.user_age !== null && data.user_age !== undefined ? String(data.user_age) : "",
              user_gender: data.user_gender || "",
              user_description: data.user_description || "",
              email: data.email || user.email || "",
              user_prefernces: data.user_prefernces || "all"
            });
            setProfileSaved(true);
          } else {
            // Set default email for new users
            setForm(f => ({ ...f, email: user.email || '' }));
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

  // Scroll to profile box if hash provided
  useEffect(() => {
    if (window.location.hash === '#user-profile-box' && profileBoxRef.current) {
      profileBoxRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [profileSaved]);

  // Simple field handler
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };

  // SUBMIT PROFILE (UPSERT by "email")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProfileSaved(false);
    try {
      if (!form.email) {
        toast.error("Email is required");
        setLoading(false);
        return;
      }
      const upsertData = {
        email: form.email,
        username: form.username,
        user_age: form.user_age ? Number(form.user_age) : null,
        user_gender: form.user_gender,
        user_description: form.user_description,
        user_prefernces: form.user_prefernces || "all",
      };
      const { error } = await supabase
        .from("user profile details")
        .upsert(upsertData, { onConflict: "email" });

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to save profile");
      } else {
        setProfileSaved(true);
        toast.success("Profile created successfully");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-8 pb-24">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        {/* Profile Details Display */}
        {profileSaved && (
          <div
            id="user-profile-box"
            ref={profileBoxRef}
            className="max-w-xl mx-auto mb-8 bg-movie-dark border border-movie-primary rounded-lg shadow p-6"
          >
            <h2 className="text-2xl font-semibold mb-3">Your Profile Details</h2>
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
                <span className="font-semibold text-movie-primary">Preferences: </span>
                <span>{preferences.find(p => p.value === form.user_prefernces)?.label ?? "All genres"}</span>
              </div>
              <div>
                <span className="font-semibold text-movie-primary">Description: </span>
                <span>{form.user_description}</span>
              </div>
            </div>
          </div>
        )}

        {/* FORM */}
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
            <label className="block font-semibold mb-1">Preferences</label>
            <select
              name="user_prefernces"
              className="w-full px-3 py-2 rounded border border-white/10 bg-movie-darker text-white"
              value={form.user_prefernces}
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
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
