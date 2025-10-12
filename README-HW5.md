# HW5 Auth Notes

- Added `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`
- Added `User` and `Session` models, cookie-based refresh, 15m access / 30d refresh
- Protected all `/contacts` routes with `authenticate`
- Each contact now belongs to a user via `userId`
