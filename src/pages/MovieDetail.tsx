
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReviewCard from '@/components/movie/ReviewCard';
import SentimentTag from '@/components/movie/SentimentTag';
import StreamingLinks from '@/components/movie/StreamingLinks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Film, MessageSquare, Star, User } from 'lucide-react';

// Mock data (would come from API in real implementation)
const MOVIE = {
  id: 1,
  title: "Dune: Part Two",
  posterPath: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
  backdropPath: "https://image.tmdb.org/t/p/original/ozBRqSHQ5mK1TbqKF1i2DzVxGQW.jpg",
  year: "2024",
  duration: "166 min",
  rating: 8.5,
  genres: ["Sci-Fi", "Adventure", "Drama"],
  director: "Denis Villeneuve",
  cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin"],
  synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
};

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

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  // In real implementation, we would fetch movie data based on ID
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Backdrop */}
        <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-movie-darker">
            <img 
              src={MOVIE.backdropPath} 
              alt={MOVIE.title}
              className="w-full h-full object-cover opacity-40"
            />
          </div>
        </div>
        
        {/* Movie Info */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-40 lg:-mt-48 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-1/4 lg:w-1/5">
              <div className="rounded-lg overflow-hidden border-2 border-white/10 shadow-xl aspect-[2/3]">
                <img 
                  src={MOVIE.posterPath} 
                  alt={MOVIE.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Details */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              <h1 className="text-2xl md:text-4xl font-bold">{MOVIE.title}</h1>
              
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-1">
                  <Star size={18} className="text-yellow-400" />
                  <span className="font-medium">{MOVIE.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-1 text-white/60">
                  <Calendar size={16} />
                  <span>{MOVIE.year}</span>
                </div>
                <div className="flex items-center space-x-1 text-white/60">
                  <Clock size={16} />
                  <span>{MOVIE.duration}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {MOVIE.genres.map((genre) => (
                  <span 
                    key={genre} 
                    className="px-3 py-1 text-xs font-medium rounded-full bg-movie-primary/20 text-movie-primary"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <p className="mt-6 text-white/80 leading-relaxed">{MOVIE.synopsis}</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-white/60 mb-2">Director</h3>
                  <p>{MOVIE.director}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/60 mb-2">Cast</h3>
                  <p>{MOVIE.cast.join(", ")}</p>
                </div>
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
                    className="cursor-pointer text-white/20 hover:text-yellow-400"
                  />
                ))}
              </div>
              <Textarea 
                placeholder="Share your thoughts on this movie..." 
                className="bg-movie-darker border-white/10 mb-4" 
                rows={4}
              />
              <Button className="bg-movie-primary hover:bg-movie-primary/90">
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
