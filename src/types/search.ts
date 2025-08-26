export type SearchFilter = 'all' | 'course' | 'product';

export interface SearchState {
  query: string;
  filter: SearchFilter;
  isSearching: boolean;
  showResults: boolean;
  results: {
    courses: any[];
    products: any[];
  };
  error: string | null;
}

export interface SearchResults {
  courses: any[];
  products: any[];
  totalCourses: number;
  totalProducts: number;
}