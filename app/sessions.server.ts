// app/sessions.js

import { Session, createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: '__session',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: ['s3cret1'],
      secure: true,
    },
  });

const isSessionValid = (session?: Session) => session?.has('userId');

export { getSession, commitSession, destroySession, isSessionValid };
