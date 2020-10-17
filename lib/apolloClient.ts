import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { auth0 } from './auth0';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/api/graphql',
});

const authLink = setContext(async () => {
  try {
    const token = await auth0.getTokenSilently();

    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  } catch (err) {
    if (err.error !== 'login_required') {
      throw err;
    }
  }

  return null;
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
});
``;
