if (process.env.NODE_ENV === 'development') require('nexus').default.reset();

const app = require('nexus').default;

app.assemble();

export default app.server.handlers.graphql;
