export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => document.querySelectorAll(sel);
export const on = (el, ev, fn) => el.addEventListener(ev, fn);
