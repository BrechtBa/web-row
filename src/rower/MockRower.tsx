"use client"
import React, { useState, useEffect } from "react";


export default class MockRower {

  constructor(){
    this._instantaneousVelocity = 0;

    const that = this;

    const t0 = new Date().getTime();

    const interval = setInterval(() => {
      const t = new Date().getTime();
      that._instantaneousVelocity = 2 + 1.5 * Math.sin(t/1000);
    }, 20);

  }

  getInstantaneousVelocity() : number {
      return this._instantaneousVelocity;
  }


}
