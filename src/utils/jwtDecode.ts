// Minimal JWT payload decoder. We only need to read claims like `user_id`
// that SimpleJWT puts in the access token — no signature verification
// happens (or is needed) on the client.
export default function jwtDecode<T>(token: string): T {
  const payload = token.split(".")[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
  return JSON.parse(decoded) as T;
}
