import { HttpServer } from "./server.ts"

const addr = '0.0.0.0:4000';
const s = new HttpServer(addr);
s.start();