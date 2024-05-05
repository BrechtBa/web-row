import Rower from './interface'

import MockRower from './MockRower'
import TapRower from './TapRower'
import WebsocketWaterRower from './WebsocketWaterRower'


export default function getRower(): Rower {
  // const rower = new MockRower();
  const rower = new TapRower();
  // const rower = new WebsocketWaterRower();

  return rower;
}