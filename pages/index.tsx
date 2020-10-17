import Head from 'next/head';
import { Container } from '@material-ui/core';
import { Navigation } from '../components/Navigation';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <Container>Home</Container>
    </div>
  );
}
