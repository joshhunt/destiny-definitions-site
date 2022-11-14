const listener = (ev) => {
  let node = ev?.target;

  while (node) {
    if (node instanceof HTMLAnchorElement) {
      break;
    }

    node = node.parentElement;
  }

  const href = node?.getAttribute("href");

  if (href?.[0] === "#") {
    ev.preventDefault();
    const id = href.slice(1);
    const target = document.querySelector(`[id="${id}"]`);
    target &&
      target.scrollIntoView({
        behavior: "smooth",
      });
  }
};

document.addEventListener("click", listener);
