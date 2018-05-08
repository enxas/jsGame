export const rotate = (patterns, direction, actorX, actorY) => {
  /* 
       Rotate skill pattern around axis (North, East, South, West)
       C - Clockwise, CC - Counter Clockwise
       90° (x, y) -> C(y, -x) -> CC(-y, x)
       180° (x, y) -> C(-x, -y) -> CC(-x, -y)
       270° (x, y) -> C(-y, x) -> CC(y, -x)
   */
  const rotatedPatterns = [];

  for (let pattern of patterns) {
    if (direction === "N") {
      // rotate 270° C(-y, x)
      let dif1 = pattern[1] + actorX;
      let dif2 = -pattern[0] + actorY;
      rotatedPatterns.push([dif1, dif2]);
    } else if (direction === "E") {
      // no need to rotate
      rotatedPatterns.push([pattern[0] + actorX, pattern[1] + actorY]);
    } else if (direction === "S") {
      // rotate 90° C(y, -x)
      let dif1 = -pattern[1] + actorX;
      let dif2 = pattern[0] + actorY;
      rotatedPatterns.push([dif1, dif2]);
    } else if (direction === "W") {
      // rotate 180° C(-x, -y)
      let dif1 = -pattern[0] + actorX;
      let dif2 = -pattern[1] + actorY;
      rotatedPatterns.push([dif1, dif2]);
    }
  }

  return rotatedPatterns;
};
export const func2 = () => {
  // do stuff
};
