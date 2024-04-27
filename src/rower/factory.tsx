import MockRower from './MockRower.tsx'
import WebsocketWaterRower from './WebsocketWaterRower.tsx'


export default function getRower() {
  const rower = new MockRower();
//   const rower = new WebsocketWaterRower();

  return rower;
}