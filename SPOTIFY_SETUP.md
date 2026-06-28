# Spotify Integration Setup

Your Spotify Client ID is already configured: `6c92e95a8e72467a90def3c3e979fa18`

## Quick Setup Steps

### 1. Get Client Secret
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Find your app with Client ID: `6c92e95a8e72467a90def3c3e979fa18`
3. Click "Show Client Secret"
4. Copy the secret

### 2. Get Refresh Token

#### Option A: Use Authorization Code Flow
1. Set redirect URI in your Spotify app settings:
   - Add `http://localhost:3001/api/spotify/callback` to Redirect URIs

2. Open this URL in your browser (replace `YOUR_CLIENT_ID`):
```
https://accounts.spotify.com/authorize?client_id=6c92e95a8e72467a90def3c3e979fa18&response_type=code&redirect_uri=http://localhost:3001/api/spotify/callback&scope=user-read-currently-playing%20user-read-recently-played
```

3. After authorizing, you'll be redirected to a URL like:
```
http://localhost:3001/api/spotify/callback?code=AQD...
```

4. Copy the `code` parameter value

5. Get refresh token by running this in terminal (replace `YOUR_CLIENT_SECRET` and `CODE`):
```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_CODE_HERE" \
  -d "redirect_uri=http://localhost:3001/api/spotify/callback" \
  -d "client_id=6c92e95a8e72467a90def3c3e979fa18" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

6. Copy the `refresh_token` from the response

#### Option B: Use Python Script
```python
import requests
import base64

client_id = "6c92e95a8e72467a90def3c3e979fa18"
client_secret = "YOUR_CLIENT_SECRET"
redirect_uri = "http://localhost:3001/api/spotify/callback"

# Step 1: Get authorization code (manual - open in browser)
auth_url = f"https://accounts.spotify.com/authorize?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope=user-read-currently-playing user-read-recently-played"
print(f"Open this URL:\n{auth_url}\n")

# Step 2: After getting code from redirect, exchange for tokens
code = input("Enter the code from the redirect URL: ")

credentials = f"{client_id}:{client_secret}"
encoded_credentials = base64.b64encode(credentials.encode()).decode()

response = requests.post(
    "https://accounts.spotify.com/api/token",
    headers={"Authorization": f"Basic {encoded_credentials}"},
    data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri
    }
)

print(f"\nRefresh Token: {response.json()['refresh_token']}")
```

### 3. Add to Environment Variables
1. Copy `.env.example` to `.env.local`
2. Add your credentials:
```env
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

### 4. Restart Dev Server
```bash
npm run dev
```

The Spotify widget will now show your currently playing or recently played track!

## How It Works

- Widget fetches current/recent track every 30 seconds
- Falls back to static data if API fails or no credentials
- Shows album art, track name, artist, and progress
- Displays Spotify green gradient when playing live data

## Troubleshooting

**Widget shows static data:**
- Check that `.env.local` has both `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REFRESH_TOKEN`
- Verify tokens are correct
- Check browser console for API errors
- Check server logs for authentication issues

**"Failed to fetch" error:**
- Refresh token may have expired (unlikely but possible)
- Client secret may be incorrect
- Network issues with Spotify API
