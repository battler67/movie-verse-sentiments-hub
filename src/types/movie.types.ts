
export interface OmdbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface Movie {
  id: string;
  title: string;
  year: string;
  posterPath: string;
  rating: number;
  genres: string[];
  director?: string;
  actors?: string;
  plot?: string;
  writer?: string;
  awards?: string;
  runtime?: string;
  boxOffice?: string;
  imdbRating?: string;
  
  // Additional TMDB fields
  adult?: boolean;
  budget?: number;
  imdbId?: string;
  overview?: string;
  productionCompanies?: { id: number; name: string; logo_path?: string }[];
  releaseDate?: string;
  revenue?: number;
  spokenLanguages?: { english_name: string; iso_639_1: string; name: string }[];
  voteCount?: number;
  backdropPath?: string;
  tagline?: string;
  status?: string;
  videos?: TmdbVideo[];
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}
