import babel from 'rollup-plugin-babel';

export default {
    input: 'src/sentinel.js',
    name: 'Sentinel',
    // sourcemap: true,
    output: {
        format: 'umd',
        file: 'dist/sentinel.js'
    },
    plugins: [
        babel()
    ]
}
