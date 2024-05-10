export default interface Rower {
  getInstantaneousVelocity() : number;

  start(): void;

  stop(): void;
  
}