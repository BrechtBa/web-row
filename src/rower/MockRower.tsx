"use client"
import Rower from './interface'


export default class MockRower implements Rower{
  instantaneousVelocity: number;

  constructor(){
    this.instantaneousVelocity = 0;
  }

  start(): void {
    const that = this;

    const t0 = new Date().getTime();

    const interval = setInterval(() => {
      const t = new Date().getTime();
      that.instantaneousVelocity = 4.0 + 0.8 * Math.sin((t - t0)/1000);
    }, 20);
  }
  
  stop(): void {

  }

  getInstantaneousVelocity() : number {
      return this.instantaneousVelocity;
  }


}
