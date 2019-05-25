import { abc } from "https://deno.land/x/abc/mod.ts";
import * as qs from "https://denolib.com/denolib/qs/mod.ts"

// TODO add bodyparser

const app = abc();
const addr = '0.0.0.0:4000'

const datafile = 'data.json'

async function getData() {
  const file = await Deno.open(datafile)
  const buf = new Uint8Array(100)
  const { nread, eof } = await Deno.read(file.rid, buf)
  const text = new TextDecoder('utf8').decode(buf);
  const trimmed = text.slice(0, buf.indexOf(0))
  file.close();
  return JSON.parse(trimmed);
}

async function updateData(content) {
  const file = await Deno.open(datafile)
  const buf = new Uint8Array(100)
  const encoded = new TextEncoder().encode(content);
  await Deno.writeFile(datafile, encoded) 
}

async function getDataById(id) {
  const data = await getData()
  return data.find(record => record.id == id)
}

app.post("/data", async c => {
  return 'thank you\n'
})
  
app.get("/data", async c => {
  const query = qs.parse(c.url._parts.query, { ignoreQueryPrefix: true })
  const id = parseInt(query.id);
  const data = await getDataById(id)
  return data
})

app.start(addr)
console.log('listening at', addr)