type PushCountListener = (count: number) => void;

const listeners = new Set<PushCountListener>();

function emitPushCountChanged(count: number) {
  listeners.forEach((listener) => {
    listener(count);
  });
}

function subscribePushCountChanged(listener: PushCountListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export { emitPushCountChanged, subscribePushCountChanged };
