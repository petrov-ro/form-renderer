export const objectCompare = (obj1: any, obj2: any): boolean => {
  if (!obj1 && !obj2) {
    return true
  }

  if (!obj1 || !obj2) {
    return false;
  }

  // Loop through properties in object 1
  // eslint-disable-next-line no-restricted-syntax
  for (const p in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, p)) {
      // Check property exists on both objects
      if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
        return false;
      }

      if (((obj1[p] === null || obj1[p] === undefined) && obj2[p] !== null && obj2[p] !== undefined)
        || ((obj2[p] === null || obj2[p] === undefined) && obj1[p] !== null && obj1[p] !== undefined)) {
        return false;
      }

      switch (typeof (obj1[p])) {
        // Deep compare objects
        case 'object':
          if (!objectCompare(obj1[p], obj2[p])) {
            return false;
          }
          break;
        // Compare function code
        case 'function':
          if (typeof (obj2[p]) === 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) {
            return false;
          }
          break;
        // Compare values
        default:
          if (obj1[p] !== obj2[p]) {
            return false;
          }
      }
    }
  }

  // Check object 2 for any extra properties
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj2) {
    if (typeof (obj1[key]) === 'undefined' && typeof (obj2[key]) !== 'undefined') {
      return false;
    }
  }

  return true;
};
