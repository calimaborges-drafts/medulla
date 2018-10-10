// TODO: Merge async-utils server e client

export function pacemaker(
  interval: number,
  callback: (...args: any[]) => void,
  ...args: any[]
): () => void {
  const clockId = setInterval(callback, interval, ...args);
  return () => {
    clearInterval(clockId);
  };
}
