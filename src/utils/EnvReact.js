export const serverPort=3001
export const server2Port=3002
export const authServerPort=3003
export const exampleServerPort=3004

export function localurl(port) {
  return "http://localhost:" + port
}

export const authServerURL = localurl(authServerPort)
export const serverURL = localurl(serverPort)
export const server2URL = localurl(server2Port)
export const exampleServerURL = localurl(exampleServerPort)

export const mapboxglKey = "pk.eyJ1IjoiMTE1NTE3MDk1MiIsImEiOiJjbGI5OXI3eDgwc21vM3BxYzd1MTNrMXA0In0.0HxBmgExZx-Y_BfWj_tF8Q"