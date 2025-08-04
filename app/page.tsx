import { MovieProvider } from '@/contexts/MovieContext';
import { MoviePickerApp } from '@/components/MoviePickerApp';

export default function Home() {
  return (
    <MovieProvider>
      <MoviePickerApp />
    </MovieProvider>
  );
}
