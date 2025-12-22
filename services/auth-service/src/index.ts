import { createApp } from "./app.js";

const main = async () => {
  const app = createApp();
  const port = 3000;
  try {
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (error) {}
};

main();
