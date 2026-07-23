// Point this at your Django backend.
// - iOS simulator: http://127.0.0.1:8000 works fine.
// - Android emulator: use http://10.0.2.2:8000 (127.0.0.1 refers to the emulator itself).
// - Physical device: use your computer's LAN IP, e.g. http://192.168.1.20:8000,
//   and make sure the phone and computer are on the same network, and that
//   Django is run with `python manage.py runserver 0.0.0.0:8000`.
export const API_BASE_URL = "http://127.0.0.1:8000";
