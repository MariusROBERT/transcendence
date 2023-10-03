function subscribe(
  eventName: string,
  listener: EventListenerOrEventListenerObject,
) {
  window.addEventListener(eventName, listener);
}

function unsubscribe(
  eventName: string,
  listener: EventListenerOrEventListenerObject,
) {
  window.removeEventListener(eventName, listener);
}

function publish(
  eventName: string,
  data: CustomEventInit<unknown> | undefined,
) {
  const event = new CustomEvent(eventName, data);
  window.dispatchEvent(event);
}

export { publish, subscribe, unsubscribe };
