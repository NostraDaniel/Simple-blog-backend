# Simple-blog-backend

In order to run the backend a .env file is needed in the root of the application. It has to contain this structure:

```
PORT=
JWT_SECRET=
DB_TYPE=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE_NAME=
JWT_EXPIRE=
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_SECURE=
```
For the email notification the free services of sendgrid.net can be used.
Also a config file has to be created with information used from Pasport in src/common/config.ts:
```
export const config = {
  jwtSecret: 'VerySecr3t!',
  expiresIn: 60 * 60, // one hour
};
```
