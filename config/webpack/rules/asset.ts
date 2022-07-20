import type webpack from 'webpack';
import svgLoader from '../loaders/svg-loader';

export const resource: webpack.RuleSetRule = {
  test: /\.(gif|jpg|jpeg|png|svg|webp)$/i,
  type: 'asset/resource',
  resourceQuery: { not: /svgr/ },
  generator: { emit: false }
};

export const source: webpack.RuleSetRule = {
  test: /\.(html|txt)$/i,
  type: 'asset/source'
};

export const svgr: webpack.RuleSetRule = {
  test: /\.svg$/i,
  issuer: /\.[jt]sx?$/,
  resourceQuery: /svgr/,
  use: [svgLoader]
};
