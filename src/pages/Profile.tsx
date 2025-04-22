
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileDisplay from '@/components/profile/ProfileDisplay';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    user_age: "",
    user_gender: "",
    user_description: "",
    email: "",
    user_preferences: "all"
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const profileBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.email) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("user profile details")
            .select("*")
            .eq("user_id", user.id)
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
              user_preferences: data.user_preferences || "all"
            });
            setProfileSaved(true);
          } else {
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

  useEffect(() => {
    if (window.location.hash === '#user-profile-box' && profileBoxRef.current) {
      profileBoxRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [profileSaved]);

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
      if (!user) {
        toast.error("You must be logged in to save your profile");
        setLoading(false);
        return;
      }

      const upsertData = {
        email: form.email,
        username: form.username,
        user_age: form.user_age ? Number(form.user_age) : null,
        user_gender: form.user_gender,
        user_description: form.user_description,
        user_preferences: form.user_preferences,
        user_id: user.id
      };
      
      const { error } = await supabase
        .from("user profile details")
        .upsert(upsertData, { onConflict: "user_id" });

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
        
        {profileSaved && (
          <div id="user-profile-box" ref={profileBoxRef}>
            <ProfileDisplay
              username={form.username}
              email={form.email}
              age={form.user_age}
              gender={form.user_gender}
              preferences={form.user_preferences}
              description={form.user_description}
            />
          </div>
        )}

        <ProfileForm
          form={form}
          onChange={onChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
