# Splitwise Mobile App (Expo + React Native + TypeScript)

A frontend for your Django REST Splitwise backend: auth, groups, expenses, settlements.

## Run it

```bash
npm install
npx expo start
```

Then either:
- Press `i` for iOS simulator, `a` for Android emulator (need Xcode / Android Studio installed), or
- Scan the QR code with the **Expo Go** app on your phone (fastest way to get started, no native toolchain needed).

## Point it at your backend

Edit `src/api/config.ts`:
- iOS simulator → `http://127.0.0.1:8000` works as-is.
- Android emulator → use `http://10.0.2.2:8000` (127.0.0.1 refers to the emulator, not your machine).
- Physical phone → use your computer's LAN IP (e.g. `http://192.168.1.20:8000`) and start Django with
  `python manage.py runserver 0.0.0.0:8000` so it's reachable from other devices.

## What's wired up

- **Auth**: `POST /users/register/`, `POST /login/`, silent token refresh via `POST /login/refresh/` on any 401
  (see `src/api/client.ts`). Tokens live in `expo-secure-store`, not AsyncStorage, so they're encrypted at rest.
- **Groups**: list/create via `/groups/`, detail view, `src/api/groups.ts`.
- **Expenses**: list/create via `/expense/`, `src/api/expenses.ts`.
- **Settlements**: `GET /expense/<group_id>/settlements/`.
- **Profile**: `/users/<id>/` and `/users/<id>/groups/`.

## ⚠️ Field names you need to verify against your serializers

I don't have your actual `serializers.py`, so I matched field names to Splitwise conventions. Please check these
against your real DRF serializer output and adjust the types/screens if they differ:

- `Expense`: I assumed `description`, `amount`, `paid_by`, `participants` (list of user IDs), `split_type`.
  Check `core/serializers.py` for the real field names — these are the ones most likely to differ.
- `Settlement`: I assumed each item looks like `{ from_user, to_user, amount }`.
- `Group`: I assumed it can return a `members` array of user objects on the detail endpoint. If `/groups/<id>/`
  only returns group metadata (no members), you'll need a separate call to `/usersgroup/` filtered by group to
  build the member list — happy to wire that up once you confirm the shape.
- JWT payload: I assumed SimpleJWT's default `user_id` claim to identify the logged-in user client-side
  (`src/context/AuthContext.tsx` → `extractUserId`). This is SimpleJWT's default, so it should be correct unless
  you've customized the token claims.

The cleanest way to lock these down: paste me the actual serializer output for `Expense`, `Settlement`, and
`Group` (or just the serializer classes), and I'll update the types and screens to match exactly.

## What's still MVP-level / not built yet

- Add-expense screen takes participant user IDs as a comma-separated text field — fine for testing, but you'll
  want a proper member picker sourced from the group's membership list.
- No unequal/percentage split UI yet (backend supports `split_type`, but the form only sends `"equal"`).
- No invite-to-group flow beyond calling `/usersgroup/` directly with a known user ID.
- No pull-to-refresh loading skeletons, no offline handling, no push notifications.

## Project structure

```
App.tsx
src/
  api/          # axios client, auth/token handling, per-resource API calls
  components/   # PrimaryButton, LabeledInput
  context/      # AuthContext (session state, login/register/logout)
  navigation/   # RootNavigator (auth stack vs. app stack)
  screens/      # Login, Register, GroupList, GroupDetail, AddExpense, Settlements, Profile
  types/        # TypeScript interfaces matching backend models
  utils/        # jwtDecode helper
```
