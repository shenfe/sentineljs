import babel from 'rollup-plugin-babel';

export default {
    input: 'src/sentinel.js',
    name: 'sentinel',
    // sourcemap: true,
    output: {
        format: 'umd',
        file: 'dist/sentinel.js'
    },
    plugins: [
        babel()
    ]
}
