export const delay = (ms: number | undefined) =>
  new Promise((res) => (ms ? setTimeout(res, ms) : setTimeout(res, 0)));
