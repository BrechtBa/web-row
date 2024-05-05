"use client"
import Rower from './interface'

export default class WebsocketWaterRower implements Rower {
  uri: string;
  ws: WebSocket | null;
  instantaneousVelocity: number;

  constructor(uri: string="ws://localhost:9899/"){
    this.uri = uri;
    this.ws = null;

    this.openWebsocket();

    this.instantaneousVelocity = 0;
  }
  openWebsocket() {    
    this.ws = new WebSocket(this.uri);

    const that = this;

    //set event handlers
    this.ws.onopen = function() {
      console.log("opening websocket");
      that.sendToWebsocket("USB")

    };
    this.ws.onmessage = function(e) {
      that.parseWebsocketMessage(e.data);
    };
    this.ws.onclose = function() {
      console.log("closed websocket");
    };

    this.ws.onerror = function(e) {
      console.error(e);
    };
  }

  sendToWebsocket(msg: string) {
    if(this.ws !== null ){
      this.ws.send(msg);
    }
  }

  parseWebsocketMessage(msg: string) {
    if(msg === "PING") {

    }
    else if(msg.startsWith("SS")) {

    }
    else if(msg.startsWith("SE")) {

    }
    else if(msg.startsWith("P")) {
      const pulseCount = Number("0x"+msg.substring(1))
      const damping = 0.99;
      const s = 2.5;
      this.instantaneousVelocity = damping*this.instantaneousVelocity + (1-damping) * pulseCount / s;
    }
    else {
      console.log(msg);
    }

  }
  getInstantaneousVelocity() : number {
      return this.instantaneousVelocity;
  }


}
