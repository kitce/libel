export type Styles = {
  'error': string;
  'icon': string;
  'input': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
