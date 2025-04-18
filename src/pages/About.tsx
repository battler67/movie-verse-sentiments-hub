
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Film } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Film size={48} className="text-movie-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-5xl font-bold mb-4">About Moodies</h1>
              <p className="text-xl text-white/70">Welcome to Moodies website where your review is respected</p>
            </div>
            
            <div className="space-y-8 text-white/80">
              <div>
                <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                <p className="leading-relaxed">
                  Moodies is a community-driven platform for movie enthusiasts to discover, review, and share opinions about their favorite films. 
                  We believe every review has a sentiment - a vibe - that contributes to the collective appreciation of cinema.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">What Makes Us Different</h2>
                <p className="leading-relaxed">
                  Unlike other review platforms, Moodies uses sentiment analysis to capture the true feeling behind each review. 
                  Whether positive, negative, or neutral, we showcase the authentic vibes that each movie inspires.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">Join Our Community</h2>
                <p className="leading-relaxed mb-4">
                  Become part of the Moodies community today. Share your thoughts, discover new films, and connect with fellow movie lovers around the world.
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/signup">
                    <Button className="bg-movie-primary hover:bg-movie-primary/90">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" className="border-white/10">
                      <Heart size={16} className="mr-2 text-movie-primary" />
                      Explore Movies
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
