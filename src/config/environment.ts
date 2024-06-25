export default () => ({
  chain: {
    id: parseInt(process.env.CHAIN_ID, 10),
    name: process.env.CHAIN_NAME,
    rpcEndpoint: process.env.RPC_ENDPOINT,
  },
  tokenAddress: process.env.TOKEN_ADDRESS,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
