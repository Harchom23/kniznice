import { isEmpty, forEach, includes } from "lodash";

export const checkFilled = (allValues, res) => {
  if (!isEmpty(allValues)) {
    if (includes(allValues, "")) {
      res.status(415).json({ response: "nezadane potrebne udaje" });
      return false;
    } else {
      return true;
    }
  }

  return false;
};
