"use client"
import Rower from './interface'


export default class TapRower implements Rower{
  instantaneousVelocity: number;
  force: number;

  constructor(){
    this.instantaneousVelocity = 5;
    this.force = 0;


   

  }

  public start(): void {

    const dt = 20;
    const tau = 3500;

    const forceTau = 500;

    const that = this;
 
    addEventListener("keypress", (event) => {
      that.force = 2.2
    });

    const interval = setInterval(() => {
      const dfdt = -that.force / forceTau;
      const dvdt = -that.instantaneousVelocity / tau + that.force/1000;

      that.force = that.force + dfdt * dt;
      that.instantaneousVelocity = that.instantaneousVelocity + dvdt * dt;
    }, 20);
  }

  getInstantaneousVelocity() : number {
      return this.instantaneousVelocity;
  }


}
