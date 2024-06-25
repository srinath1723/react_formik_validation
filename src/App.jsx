import React from 'react';
import { RouterProvider, createBrowserRouter, Link } from 'react-router-dom';
import BookData from './components/BookData';
import { loader as BooksLoader } from './components/BookData';
import Dashboard from './components/Dashboard';
import "./App.css";
import AuthorsData from './components/AuthorsData';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    children: [
      {
        path: '/',
        element: (
          <div className='cards container'>
            <Link to="/bookdata" className='link'>
              <div className="card1 card">
                <img src="https://img.freepik.com/free-photo/creative-composition-world-book-day_23-2148883765.jpg" alt="" />
                <h2 className='book text-center fw-bold'>Books</h2>
              </div>
            </Link>
            <hr/>
            <Link to="/authorsdata" className='link'>
              <div className="card2 card">
                <img src="https://images.pexels.com/photos/851213/pexels-photo-851213.jpeg?cs=srgb&dl=pexels-fotios-photos-851213.jpg&fm=jpg" alt="" />
                <h2 className='author text-center fw-bold'>Authors</h2>
              </div>
            </Link>
          </div>
        ),
      },
      {
        path: "/bookdata",
        element: <BookData />,
        loader: BooksLoader
      },
      {
        path: "/authorsdata",
        element: <AuthorsData />,
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
