'use strict'

// Needs node v10+

/**
 * Module dependencies
 */
const { writeFile } = require('fs')
const { rollup } = require('rollup')
const babel = require('@babel/core')
const presetMinify = require('babel-preset-minify')
const classProperties = require('@babel/plugin-proposal-class-properties')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const inputConfig = {
  input: './src/index.js',

  // Avoid: The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten
  context: 'this',

  plugins: [
    resolve(),
    commonjs()
  ],

  /**
   * @see https://github.com/rollup/rollup/issues/1185#issuecomment-384631306
   */
  acorn: {
    plugins: {
      classFields: true,
      staticClassPropertyInitializer: true
    }
  },

  acornInjectPlugins: [
    require('acorn-class-fields/inject'),
    require('acorn-static-class-property-initializer/inject')
  ]
}

const outputConfig = [
  {
    file: './dist/galaxy.esm.js',
    format: 'es'
  },
  {
    file: './dist/galaxy.js',
    format: 'umd',
    name: 'Galaxy'
  }
]

rollup(inputConfig)
  .then(bundle => Promise.all(outputConfig.map(output => bundle.write(output))))
  .then(([, umdChunk]) => {
    writeFile('./dist/galaxy.min.js', minifyChunk(umdChunk), err => {
      if (err) throw err

      process.nextTick(() => {
        console.log('UMD bundle minified sucessfully!')
      })
    })
  })
  .catch(console.error)

function minifyChunk ({ code }) {
  const bundle = babel.transformSync(code, {
    presets: [presetMinify],
    plugins: [classProperties, templateLiteralMinifier],
    babelrc: false,
    configFile: false,
    comments: false,
    sourceMaps: false,
    minified: true,
    sourceType: 'script'
  })

  return bundle.code
}

function templateLiteralMinifier ({ types: t }) {
  const trimmed = []

  return {
    visitor: {
      TemplateLiteral (path) {
        if (trimmed.includes(path.node)) return

        const TRIM_REGEX = /\r?\n/g

        const quasis = []

        for (const { value, tail } of path.node.quasis) {
          quasis.push(
            t.templateElement({
              raw: value.raw.replace(TRIM_REGEX, ''),
              cooked: value.cooked.replace(TRIM_REGEX, '')
            }, tail)
          )
        }

        const replacement = t.templateLiteral(quasis, path.node.expressions)

        trimmed.push(replacement)
        path.replaceWith(replacement)
      }
    }
  }
}
