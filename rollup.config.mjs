import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve'; // 解析 node_modules 中的模块
import commonjs from '@rollup/plugin-commonjs';
import { string } from "rollup-plugin-string";

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'index.ts',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
      sourcemap: !isProduction,
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    string({
      include: ["**/*.hbs", "**/*.tpl"],
    }),
  ]
};
