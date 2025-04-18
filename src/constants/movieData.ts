
export const OMDB_API_KEY = 'd2208170';
export const OMDB_API_URL = 'http://www.omdbapi.com/';

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Romance'
];

export const GENRE_MOVIE_MAPPING = {
  'Action': ['tt0111161', 'tt0468569', 'tt0133093', 'tt0172495'],
  'Adventure': ['tt0167260', 'tt0120737', 'tt0816692', 'tt0076759'],
  'Comedy': ['tt0118799', 'tt0110912', 'tt0109830', 'tt0107290'],
  'Drama': ['tt0068646', 'tt0109830', 'tt0120338', 'tt0109830'],
  'Sci-Fi': ['tt0816692', 'tt0133093', 'tt0816692', 'tt0482571'],
  'Horror': ['tt0081505', 'tt0078748', 'tt0084787', 'tt0070047'],
  'Thriller': ['tt0114369', 'tt0102926', 'tt0110413', 'tt0167404'],
  'Romance': ['tt0338013', 'tt0120338', 'tt0211915', 'tt0211915']
} as const;
