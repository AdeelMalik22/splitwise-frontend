# Splitwise Frontend

## Project overview

This is an Expo + React Native + TypeScript mobile frontend for a Django REST Splitwise backend. The interface follows a monochrome expense-sharing design with Home, Groups, Add Expense, Activity, Profile, group details, balances, settlement, and payment-success flows.

## Run and validate

```bash
npm install
npx expo start
npx expo export --platform web
```

Use `w` for the web preview, `a` for Android, and `i` for iOS. Android requires Android Studio, an SDK, an emulator or device, and a working `adb` command.

## Backend configuration

Set the API host in `src/api/config.ts`:

- iOS simulator: `http://127.0.0.1:8000`
- Android emulator: `http://10.0.2.2:8000`
- Physical device: use the computer LAN IP and run Django on `0.0.0.0:8000`

The Postman collection is `splitwise_be_postman_collection.json`.

Available backend endpoints:

- `GET /health/`
- `POST /users/register/`
- `POST /login/`
- `POST /login/refresh/`
- `GET /users/<id>/`
- `GET /users/<id>/groups/`
- `GET|POST /groups/`
- `GET|POST /usersgroup/`
- `GET /usersgroup/<group_id>/users/`
- `GET|POST /expense/`
- `GET /expense/<expense_id>/`
- `GET /expense/<group_id>/settlements/`

Authentication tokens are stored in Expo Secure Store on native platforms and local storage on web. The Axios client automatically attaches access tokens and retries a single 401 after refreshing them.

## Code conventions

- Use functional React components and hooks.
- Keep navigation params strictly typed in `src/navigation/RootNavigator.tsx`.
- Use `StyleSheet.create`; do not add Tailwind, NativeWind, HTML, or web-only UI.
- Use `@expo/vector-icons` for icons.
- Keep reusable UI in `src/components`.
- Keep API calls in `src/api`; screens should not construct Axios requests directly.
- Keep sample/demo records in `src/data/mockData.ts`.
- Preserve the monochrome palette. Green and red are reserved for positive and negative balances.
- Maintain a roughly 390 × 844 phone layout with 20–24px horizontal page padding, compact rows, thin dividers, and a custom five-item bottom bar with a raised center Add button.

## Important product behavior

- Add Expense must send `group_id`, `name`, `description`, numeric `amount`, `paid_by`, and `split_on`.
- Settlements are returned as an object with `You need to pay` and `you will get` arrays.
- Group and expense serializers are the source of truth if field names differ from the current TypeScript models.
- The backend currently has no endpoint for recording a completed payment, deleting/updating expenses, notifications, or user search/invites beyond adding a known user ID.

## Before finishing changes

Run the web export and inspect the affected screen at a phone-sized viewport. Verify loading, empty, error, and success states, then run `git diff --check`.
