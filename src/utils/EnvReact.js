import { localurl } from "./Utils";

export const serverPort=3001
export const server2Port=3002
export const authServerPort=3003
export const exampleServerPort=3004

let env = {}

// Load Env variables, if failed, repeat until success or reached 10 times
export const onLoad = async (count = 0) => {
  const reponse = await fetch(localurl(3002) + "/env", { method: "GET" })
  if (!reponse.ok)
    return count < 10 ? setTimeout(onLoad(count + 1), 1000) : env = { ok: reponse.ok }

  const json = await reponse.json()
  return env = {
    ok: reponse.ok,
    mapboxglKey: json.mapboxglKey
  }
}

export const authServerURL = localurl(authServerPort)
export const serverURL = localurl(serverPort)
export const server2URL = localurl(server2Port)
export const exampleServerURL = localurl(exampleServerPort)

// export const mapboxglKey = () => "pk.eyJ1IjoiMTE1NTE3MDk1MiIsImEiOiJjbGI5OXI3eDgwc21vM3BxYzd1MTNrMXA0In0.0HxBmgExZx-Y_BfWj_tF8Q"

export const ok = () => env.ok
export const mapboxglKey = () => env.mapboxglKey