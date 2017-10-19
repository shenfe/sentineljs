import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
    input: 'src/sentinel.js',
    name: 'Sentinel',
    // sourcemap: true,
    output: {
        format: 'umd',
        file: 'dist/sentinel.min.js'
    },
    plugins: [
        babel(),
        uglify({
            // mangle: false,
            ie8: true
        })
    ]
}
