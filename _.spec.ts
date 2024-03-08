// bun:test
import { describe, it, expect } from "bun:test";

// Module: Mule
import Mule from "./src/mule";

// ENV
const PORT: number = 3000;

describe("Mule Serve", (): void => {
  it(`Should Mule.run Listen Port :${PORT}`, (): void => {
    let mule = new Mule("", PORT);
    expect(mule.getPort()).toBe(PORT);
    mule.run();
  });
});
