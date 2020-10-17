import { Auth0Client } from '@a-type/auth0-react';

export const auth0 = new Auth0Client({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
});
