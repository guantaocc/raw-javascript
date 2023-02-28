/**
 * 滚动行为
 */

/**
 * 是否平滑进行滚动到可见区域
 */

function smoothScroll(element) {
  document.querySelector(element).scrollIntoView({
    behavior: "smooth",
  });
}
