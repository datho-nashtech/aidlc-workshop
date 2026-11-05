import { createApp } from "./http.ts";

const port = Number(process.env.PORT ?? 3001);
const { server } = createApp();
server.listen(port, () => {
  process.stdout.write(`u1-venue-booking listening on ${port}\n`);
});
