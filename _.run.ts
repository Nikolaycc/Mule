// Module: Mule
import Mule from "./src/mule";

// ENV
const PORT: number = 3000;

let mule = new Mule("./spec/project/pages", PORT);
mule.run();
