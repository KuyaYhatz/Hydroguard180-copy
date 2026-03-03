import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster as Sonner } from 'sonner';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Sonner position="top-right" />
    </>
  );
}
