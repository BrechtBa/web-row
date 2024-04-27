"use client"
import React, { useState, useEffect } from "react";


export default class WebsocketWaterRower {

  constructor(uri: string="ws://localhost:9899/"){
    this.uri = uri;
    this.ws = null;

    this.openWebsocket();

    this._instantaneousVelocity = 0;
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
    this.ws.send(msg);
  }

  parseWebsocketMessage(msg: string) {
    console.log(msg);
    if(msg === "PING") {

    }
    else if(msg.startsWith("SS")) {

    }
    else if(msg.startsWith("SE")) {

    }
    else if(msg.startsWith("P")) {
      const pulseCount = Number("0x"+msg.substring(1))
      const damping = 0.98;
      const s = 5;
      this._instantaneousVelocity = damping*this._instantaneousVelocity + (1-damping) * pulseCount / s;
    }

  }
  getInstantaneousVelocity() : number {
      return this._instantaneousVelocity;
  }


}
