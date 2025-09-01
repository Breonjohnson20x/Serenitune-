# Serenitune - Sound Therapy Web Application

Serenitune is a full-stack web application that allows users to explore and create playlists of sound therapy tracks. The application features user authentication, a library of sound therapy tracks, custom playlist creation, and audio visualization.

## Features

- User registration and authentication with JWT
- Browse and search sound therapy tracks by category
- Create, edit, and share custom playlists with drag-and-drop functionality
- Audio playback with waveform visualization
- Mood tracking after listening sessions
- Responsive design with modern UI using Serenitune's color palette
- Gentle background animations and gradient effects
- REST API for tracks and playlists

## Tech Stack

### Frontend
- React with hooks
- React Router for client-side routing
- Tailwind CSS for styling
- Shadcn/UI component library
- Web Audio API for audio playback and visualization
- React DnD for drag-and-drop playlist management

### Backend
- Python with Flask
- SQLAlchemy ORM for database models
- JWT authentication
- SQLite database (configurable for PostgreSQL)
- RESTful API endpoints
- CORS support for cross-origin requests

## Project Structure

```
serenitune/
├── serenitune-backend/     # Flask backend
│   ├── src/
│   │   ├── database/       # Database files
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API routes
│   │   ├── static/         # Static files
│   │   │   └── audio/      # Audio files
│   │   └── main.py         # Main application file
│   ├── generate_audio.py   # Script to generate audio files
│   └── seed_database.py    # Script to seed the database
│
├── serenitune-frontend/    # React frontend
│   ├── public/             # Public assets
│   └── src/
│       ├── components/     # React components
│       ├── contexts/       # React contexts
│       ├── pages/          # Page components
│       ├── routes/         # Routing configuration
│       └── services/       # API services
│
└── deployment/             # Deployment configuration
    ├── backend/            # Backend deployment files
    ├── frontend/           # Frontend deployment files
    └── docker-compose.yml  # Docker Compose configuration
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd serenitune-backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Generate audio files:
   ```bash
   python generate_audio.py
   ```

5. Seed the database:
   ```bash
   python seed_database.py
   ```

6. Start the Flask server:
   ```bash
   python src/main.py
   ```

   The backend will be available at http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd serenitune-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   The frontend will be available at http://localhost:5173

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in an existing user
- `GET /api/auth/me`: Get current user information

### Track Endpoints

- `GET /api/tracks`: Get all tracks
- `GET /api/tracks/:id`: Get a specific track
- `GET /api/tracks/categories`: Get all track categories

### Playlist Endpoints

- `GET /api/playlists`: Get all playlists for the current user
- `GET /api/playlists/:id`: Get a specific playlist
- `POST /api/playlists`: Create a new playlist
- `PUT /api/playlists/:id`: Update a playlist
- `DELETE /api/playlists/:id`: Delete a playlist
- `POST /api/playlists/:id/tracks`: Add a track to a playlist
- `DELETE /api/playlists/:id/tracks/:track_id`: Remove a track from a playlist
- `PUT /api/playlists/:id/reorder`: Reorder tracks in a playlist

### Mood Endpoints

- `POST /api/mood`: Create a new mood rating entry
- `GET /api/mood/history`: Get mood history for the current user

## Configuration

### Backend Configuration

The Flask backend can be configured by setting environment variables:

- `SECRET_KEY`: Secret key for JWT token generation (default: a random string)
- `DATABASE_URL`: Database connection URL (default: SQLite)
- `DEBUG`: Enable debug mode (default: True in development)

### Frontend Configuration

The frontend API URL can be configured in `vite.config.js` by updating the proxy settings.

## Database Migration

To migrate the database schema:

1. Delete the existing database file:
   ```bash
   rm src/database/app.db
   ```

2. Run the seed script to recreate the database with the updated schema:
   ```bash
   python seed_database.py
   ```

## Adding New Tracks

New tracks can be added by:

1. Adding audio files to the `src/static/audio/` directory
2. Updating the `seed_database.py` script to include the new tracks
3. Running the seed script:
   ```bash
   python seed_database.py
   ```

## Deployment

For detailed deployment instructions, see the [Deployment Guide](./deployment/DEPLOYMENT_GUIDE.md).

### Quick Deployment with Docker

1. Navigate to the deployment directory:
   ```bash
   cd deployment
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your configuration.

4. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

The application will be available at http://localhost.

### Backend Deployment

1. Set appropriate environment variables for production:
   ```bash
   export SECRET_KEY="your-secure-secret-key"
   export DEBUG=False
   ```

2. For PostgreSQL, set the database URL:
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost/serenitune"
   ```

3. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 "src.main:app"
   ```

### Frontend Deployment

1. Build the production version:
   ```bash
   npm run build
   # or
   pnpm build
   ```

2. Serve the built files from the `dist` directory using a web server like Nginx or Apache.

## Included Sound Therapy Tracks

The application comes with four pre-generated sound therapy tracks:

1. **Relax (432 Hz)**: A pure tone at 432 Hz, known for its relaxing properties
2. **Focus (639 Hz)**: A pure tone at 639 Hz, associated with enhanced concentration
3. **Sleep (528 Hz)**: A pure tone at 528 Hz, believed to promote restful sleep
4. **Lofi Beat**: A generated lofi beat for general relaxation and focus

## Future Enhancements

Potential enhancements for future versions:

- Integration with Stripe or PayPal for premium subscriptions
- Recommendations engine based on mood history
- Social features like liking and commenting on playlists
- Mobile applications using React Native
- Advanced audio effects and filters
- Integration with smart home devices

## License

This project is licensed under the MIT License.

## Acknowledgements

- Sound therapy frequencies based on research in music therapy and sound healing
- UI design inspired by modern audio streaming platforms
- Audio generation techniques using Python's NumPy and SciPy libraries

