type zoneCheck = {
  isNearCenter: boolean;
};

function checkElementPosition(el: HTMLElement, threshold = 100): zoneCheck {
  const rect = el.getBoundingClientRect();
  const viewportCenterX = window.innerWidth / 2;
  const elementCenterX = rect.left + rect.width / 2;
  const distanceX = Math.abs(viewportCenterX - elementCenterX);
  const isNearCenter = distanceX < threshold;

  return { isNearCenter };
}

export default checkElementPosition;
