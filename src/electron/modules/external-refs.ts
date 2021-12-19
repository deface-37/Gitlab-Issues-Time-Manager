import { shell } from 'electron';

document.addEventListener('click', (ev) => {
  const anchor = ev.composedPath().find((el) => {
    return el instanceof HTMLAnchorElement;
  });

  if (anchor) {
    ev.preventDefault();
    shell.openExternal((anchor as HTMLAnchorElement).href);
  }
});
