function subscribe(eventName:string, listener: any) {
    window.addEventListener(eventName, listener);
}
  
  function unsubscribe(eventName:string, listener: any) {
    window.removeEventListener(eventName, listener);
}
  
  function publish(eventName:string, data: any) {
    const event = new CustomEvent(eventName, data);
    window.dispatchEvent(event);
}
  
export { publish, subscribe, unsubscribe };