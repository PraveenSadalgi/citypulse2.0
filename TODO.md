# Profile Section Update to Fetch from DB

## Tasks
- [x] Add fetchProfile function in lib/local-db.ts to retrieve user profile from Supabase 'profiles' table
- [x] Update app/profile/page.tsx to fetch profile data from DB instead of using mockProfileData
- [x] Update app/profile/page.tsx to fetch posts from DB using getPostsFromDB()
- [x] Handle authentication: ensure user is logged in, redirect if not
- [x] Test the profile page to verify data loads from DB (server running on localhost:3001)
- [x] Handle loading states and errors appropriately
