// @ts-ignore
const app = require('./src/app');
const { connectToDB } = require('./src/utils/db');

const PORT = process.env.PORT || 3000;

connectToDB();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on port ${PORT}`);
});
