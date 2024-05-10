"use client"
import Rower from './interface'


export default class TapRower implements Rower{
  instantaneousVelocity: number;
  force: number;
  interval: ReturnType<typeof setInterval> | null;
  tapHandler: (e: object) => void

  constructor(){
    this.instantaneousVelocity = 5;
    this.force = 0;
    this.interval = null;

    this.tapHandler = this.tap.bind(this);
  }

  tap(event: object): void {
    this.force = 2.0;
  }


  public start(): void {
    this.instantaneousVelocity = 2;
    this.force = 0;

    const dt = 20;
    const tau = 3.5;
    const mass = 1;

    const forceTau = 1.2;

    const that = this;

    addEventListener("click", this.tapHandler);
    addEventListener("keypress", this.tapHandler);

    if(this.interval === null) {
      this.interval = setInterval(() => {
        const dfdt = -that.force / forceTau;
        const dvdt = -that.instantaneousVelocity / tau + that.force/mass;
  
        that.force = that.force + dfdt * dt/1000;
        that.instantaneousVelocity = that.instantaneousVelocity + dvdt * dt/1000;
      }, 20);
    }
  }

  stop(): void {
    removeEventListener('click', this.tapHandler)
    removeEventListener('keypress', this.tapHandler)
  }

  getInstantaneousVelocity() : number {
      return this.instantaneousVelocity;
  }


}
