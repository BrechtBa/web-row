"use client"
import IRower from './interface.tsx'


export default class MockRower implements IRower{

  constructor(){
    this._instantaneousVelocity = 0;

    const that = this;

    const t0 = new Date().getTime();

    const interval = setInterval(() => {
      const t = new Date().getTime();
      that._instantaneousVelocity = 4.0 + 0.8 * Math.sin(t/1000);
    }, 20);

  }

  getInstantaneousVelocity() : number {
      return this._instantaneousVelocity;
  }


}
