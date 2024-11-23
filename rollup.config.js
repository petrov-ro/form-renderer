import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import scss from "rollup-plugin-scss";
import PeerDepsExternalPlugin from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/cjs/index.js",
                format: "cjs",
                sourcemap: true,
            },
            {
                file: "dist/esm/index.js",
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [
            scss({
                fileName: 'assets/bundle.css',
                failOnError: true
            }),
            PeerDepsExternalPlugin(),
            resolve(),
            nodeResolve(),
            commonjs(),
/*            terser({
                ecma: 2021,
                module: true,
                warnings: true,
            }),*/
            typescript({ tsconfig: "./tsconfig.json" }),
            json()
        ],
    },
    {
        input: "dist/esm/types/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
    },
];
