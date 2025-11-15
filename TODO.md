# TODO: Update Profile Section to Fetch from DB

## Tasks
- [x] Add `getProfileFromDB(userId: string)` in `lib/local-db.ts` to fetch profile data from Supabase `profiles` table.
- [x] Update `saveProfile()` in `lib/local-db.ts` to include `avatar` as `avatar_url` in the upsert to `profiles` table.
- [x] Modify `app/profile/page.tsx` `useEffect` to get current user ID from Supabase auth and fetch profile using `getProfileFromDB`.
- [x] Update save logic in `app/profile/page.tsx` to store avatar URL in DB as `avatar_url`.
- [x] Add confirmation dialog for profile photo upload before storing the photo.
- [x] Test profile loading and editing to ensure data comes from DB.
