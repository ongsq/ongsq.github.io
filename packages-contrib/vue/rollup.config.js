import nodeResolve from '@rollup/plugin-node-resolve'

// only for creating the .global(.min).js file!!!
// TODO: in future, make own wrapper file instead of having main.ts handle all envs

const EXTERNAL_GLOBALS = {
  vue: 'Vue',
  '@fullcalendar/core': 'FullCalendar'
}

export default [
  {
    input: 'dist/main.js',
    output: {
      format: 'iife',
      file: 'dist/main.global.js',
      name: 'FullCalendarVue',
      exports: 'named',
      globals: EXTERNAL_GLOBALS
    },
    external: Object.keys(EXTERNAL_GLOBALS),
    plugins: [
      nodeResolve() // for resolving tslib
    ]
  }
]
