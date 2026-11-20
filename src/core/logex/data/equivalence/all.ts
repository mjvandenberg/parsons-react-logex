import oneFinal1 from "./oneFinal1.js";
import oneFinal2 from "./oneFinal2.js";
import oneFinal3 from "./oneFinal3.js";
import oneFinal4 from "./oneFinal4.js";
import oneFinal5 from "./oneFinal5.js";
import oneFinal6 from "./oneFinal6.js";
import easy from "./easy.js";
import normal from "./normal.js";
import difficult from "./difficult.js";

const allExercises = {
  "Exercise 1": oneFinal1,
  "Exercise 2": oneFinal2,
  "Exercise 3": oneFinal3,
  "Exercise 4": oneFinal4,
  "Exercise 5": oneFinal5,
  "Exercise 6": oneFinal6,
  "Exercise 7": easy,
  "Exercise 8": normal,
  "Exercise 9": difficult,
};

export type exerciseNames = keyof typeof allExercises;

export default allExercises;
