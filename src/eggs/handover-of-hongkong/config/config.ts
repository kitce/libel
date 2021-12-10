import { isMainApp } from './../../../helpers/app';

const now = new Date();
const month = now.getMonth() + 1;
const date = now.getDate();
export const enabled = (
  month === 7
  && date === 1
  && isMainApp()
);
