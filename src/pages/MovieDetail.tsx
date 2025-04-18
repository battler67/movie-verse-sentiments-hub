
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReviewCard from '@/components/movie/ReviewCard';
import SentimentTag from '@/components/movie/SentimentTag';
import StreamingLinks from '@/components/movie/StreamingLinks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Film, MessageSquare, Star, Award, User, DollarSign } from 'lucide-react';
import { fetchMovieById, Movie } from '../services/movieService';
import { useToast } from '@/hooks/use-toast';

// Mock streaming data (would come from API in real implementation)
const STREAMING_PROVIDERS = [
  {
    name: "HBO Max",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/2560px-HBO_Max_Logo.svg.png",
    url: "https://www.hbomax.com/",
  },
  {
    name: "Amazon Prime",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prime_Video.png/800px-Prime_Video.png",
    url: "https://www.amazon.com/prime",
  },
  {
    name: "Apple TV+",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Apple_TV_Plus_logo.svg/1024px-Apple_TV_Plus_logo.svg.png",
    url: "https://www.apple.com/apple-tv-plus/",
  },
];

// Mock review data
const REVIEWS = [
  {
    id: 1,
    username: "MovieFan42",
    date: "Apr 12, 2024",
    rating: 5,
    comment: "Denis Villeneuve has crafted a masterpiece that expands on the first film in every way. The visuals are breathtaking, Hans Zimmer's score is phenomenal, and the performances are top-notch. A perfect sci-fi epic that honors the source material while creating something truly cinematic.",
    sentiment: "positive" as const,
  },
  {
    id: 2,
    username: "CinematicCritic",
    date: "Mar 28, 2024",
    rating: 4,
    comment: "While visually stunning and impressively acted, the pacing in the middle section drags slightly. Still, the world-building is incredible and the action sequences are spectacular. A worthy continuation of the Dune saga.",
    sentiment: "neutral" as const,
  },
  {
    id: 3,
    username: "SciFiNerd",
    date: "Mar 10, 2024",
    rating: 2,
    comment: "Too long and too self-important. The film takes itself so seriously that it forgets to be entertaining. The visuals can't make up for the tedious storytelling and underdeveloped characters.",
    sentiment: "negative" as const,
  },
];

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    const loadMovie = async () => {
      try {
        if (id) {
          setLoading(true);
          const movieData = await fetchMovieById(id);
          setMovie(movieData);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadMovie();
  }, [id, toast]);
  
  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
  };
  
  const handleReviewSubmit = () => {
    if (userRating === 0) {
      toast({
        title: "Please add a rating",
        description: "Don't forget to rate the movie before submitting your review.",
        variant: "destructive"
      });
      return;
    }
    
    if (reviewText.trim() === "") {
      toast({
        title: "Review is empty",
        description: "Please write your thoughts about the movie.",
        variant: "destructive"
      });
      return;
    }
    
    // Here we would submit to Supabase in a real implementation
    toast({
      title: "Review submitted",
      description: "Your review has been saved successfully.",
    });
    
    setUserRating(0);
    setReviewText("");
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-48 bg-white/10 rounded mb-4"></div>
            <div className="h-4 w-64 bg-white/10 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!movie) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
            <p className="text-white/60">The movie you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Backdrop */}
        <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-movie-darker">
            <div className="w-full h-full bg-movie-dark bg-opacity-60 backdrop-blur-sm flex items-center justify-center">
              {movie.posterPath && movie.posterPath !== 'https://placeholder.svg' ? (
                <img 
                  src={movie.posterPath} 
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-40"
                />
              ) : (
                <Film size={64} className="text-white/20" />
              )}
            </div>
          </div>
        </div>
        
        {/* Movie Info */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-40 lg:-mt-48 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-1/4 lg:w-1/5">
              <div className="rounded-lg overflow-hidden border-2 border-white/10 shadow-xl aspect-[2/3]">
                {movie.posterPath && movie.posterPath !== 'https://placeholder.svg' ? (
                  <img 
                    src={movie.posterPath} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-movie-dark">
                    <Film size={64} className="text-white/20" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Details */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              <h1 className="text-2xl md:text-4xl font-bold">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {movie.imdbRating && (
                  <div className="flex items-center space-x-1">
                    <Star size={18} className="text-yellow-400" />
                    <span className="font-medium">{movie.imdbRating}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 text-white/60">
                  <Calendar size={16} />
                  <span>{movie.year}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center space-x-1 text-white/60">
                    <Clock size={16} />
                    <span>{movie.runtime}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres && movie.genres.map((genre) => (
                  <span 
                    key={genre} 
                    className="px-3 py-1 text-xs font-medium rounded-full bg-movie-primary/20 text-movie-primary"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <p className="mt-6 text-white/80 leading-relaxed">{movie.plot}</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.director && (
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-2">Director</h3>
                    <p>{movie.director}</p>
                  </div>
                )}
                {movie.writer && (
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-2">Writer</h3>
                    <p>{movie.writer}</p>
                  </div>
                )}
                {movie.actors && (
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-2">Cast</h3>
                    <p>{movie.actors}</p>
                  </div>
                )}
                {movie.awards && (
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-2">Awards</h3>
                    <div className="flex items-start">
                      <Award size={16} className="text-yellow-400 mr-2 mt-1" />
                      <p>{movie.awards}</p>
                    </div>
                  </div>
                )}
                {movie.boxOffice && movie.boxOffice !== 'N/A' && (
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-2">Box Office</h3>
                    <div className="flex items-center">
                      <DollarSign size={16} className="text-green-500 mr-2" />
                      <p>{movie.boxOffice}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button className="bg-movie-primary hover:bg-movie-primary/90">
                  <MessageSquare size={16} className="mr-2" />
                  Write a Review
                </Button>
                <Button variant="outline" className="border-white/10">
                  <Star size={16} className="mr-2" />
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
          
          {/* Streaming Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Where to Watch</h2>
            <StreamingLinks providers={STREAMING_PROVIDERS} />
          </div>
          
          {/* Reviews Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Reviews</h2>
              <div className="flex items-center space-x-3">
                <SentimentTag sentiment="positive" className="border border-white/5" />
                <SentimentTag sentiment="negative" className="border border-white/5" />
                <SentimentTag sentiment="neutral" className="border border-white/5" />
                <Button variant="outline" size="sm" className="border-white/10">
                  Filter
                </Button>
              </div>
            </div>
            
            {/* Add Review */}
            <div className="border border-white/5 rounded-lg bg-movie-dark p-4 md:p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Write a Review</h3>
              <div className="flex items-center space-x-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={24} 
                    className={`cursor-pointer ${
                      i < userRating ? "text-yellow-400" : "text-white/20 hover:text-yellow-400"
                    }`}
                    onClick={() => handleRatingClick(i + 1)}
                  />
                ))}
              </div>
              <Textarea 
                placeholder="Share your thoughts on this movie..." 
                className="bg-movie-darker border-white/10 mb-4" 
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <Button 
                className="bg-movie-primary hover:bg-movie-primary/90"
                onClick={handleReviewSubmit}
              >
                Submit Review
              </Button>
            </div>
            
            {/* Reviews List */}
            <div className="space-y-4">
              {REVIEWS.map((review) => (
                <ReviewCard
                  key={review.id}
                  username={review.username}
                  date={review.date}
                  rating={review.rating}
                  comment={review.comment}
                  sentiment={review.sentiment}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovieDetail;
