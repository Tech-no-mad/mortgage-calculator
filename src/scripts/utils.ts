export function animateValue(obj: HTMLElement | null, start: number, end: number, duration: number, isCurrency: boolean = true) {
  if (!obj) return;
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Easing: easeOutQuart
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(easeProgress * (end - start) + start);
    if (isCurrency) {
      // Keep the HTML structure if it has spans
      const innerSpan = obj.querySelector('span');
      if (innerSpan) {
        innerSpan.innerText = '$' + current.toLocaleString('en-US');
      } else {
        obj.innerText = '$' + current.toLocaleString('en-US');
      }
    } else {
      const innerSpan = obj.querySelector('span');
      if (innerSpan) {
        innerSpan.innerText = current.toString();
      } else {
        obj.innerText = current.toString();
      }
    }
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      // Final exact value
      const finalStr = isCurrency ? '$' + Math.round(end).toLocaleString('en-US') : Math.round(end).toString();
      const innerSpan = obj.querySelector('span');
      if (innerSpan) {
        innerSpan.innerText = finalStr;
      } else {
        obj.innerText = finalStr;
      }
    }
  };
  window.requestAnimationFrame(step);
}