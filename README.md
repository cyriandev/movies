This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


### See Demo:
[Demo](https://moviesntv.cyriandev.co.za)

## Supabase watchlist and watched tracking setup

1. Copy `.env.example` to `.env.local` and provide:
   - `REACT_APP_TMDB_API_KEY`
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_PUBLISHABLE_KEY`
   - For GitHub Actions deploys, set:
     - `REACT_APP_TMDB_API_KEY` as a GitHub **Secret**
     - `REACT_APP_SUPABASE_URL` as a GitHub **Variable**
     - `REACT_APP_SUPABASE_PUBLISHABLE_KEY` as a GitHub **Variable**
2. In Supabase, run the SQL migration in `supabase/migrations/20260419183500_user_tracking.sql`.
   - If you already set up an older version of the schema, also run `supabase/migrations/20260419202000_remove_watched_shows.sql` and `supabase/migrations/20260419203500_unify_watchlist_status.sql`.
3. Enable **Email** sign-in in Supabase Auth. Google is optional and can be enabled later.
4. For a 6-digit email OTP instead of the default confirmation link:
   - Go to **Authentication -> Email Templates -> Magic Link**
   - Set the subject to `Your moviesntv login code`
   - Paste `supabase/templates/email-otp.html` into the template body
   - Keep `{{ .Token }}` in the template so Supabase sends a code, not `{{ .ConfirmationURL }}`
5. Set your local site URL / redirect URL to `http://localhost:3000/auth/callback`.
6. Run `npm start`.

The app keeps TMDB as the catalog source and stores personal watchlist status plus watched episodes in Supabase. Email auth in the app now uses a one-time code flow instead of passwords.
