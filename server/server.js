const app = require('./app')
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.EVE_PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});