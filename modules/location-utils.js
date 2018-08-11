function serialise(location) {
  if (location.length === 0) {
    return undefined;
  }

  let result = location[0];

  for (let i = 1; i < location.length; i++) {
    if (typeof location[i] === 'number') {
      result += `[${location[i]}]`;
    } else {
      result += `.${location[i]}`;
    }
  }

  return result;
}

exports.serialise = serialise;
