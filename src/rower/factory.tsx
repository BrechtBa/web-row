import Rower from './interface'

import MockRower from './MockRower'
import TapRower from './TapRower'
import WebsocketWaterRower from './WebsocketWaterRower'

export enum RowerType {
  Tap = "Tap",
  WebsocketWaterrower = "WebsocketWaterrower",
}

export default function getRower(type?: RowerType): Rower {

  if(type === RowerType.WebsocketWaterrower) {
    return new WebsocketWaterRower();
  }

  return new TapRower();
}