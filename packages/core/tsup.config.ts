import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    entry: {
      index: 'src/index.ts'
    },
    resolve: true,
    compilerOptions: {
      moduleResolution: "bundler",
      composite: false
    }
  },
  clean: true,
  splitting: true,
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  external: [
    '@libsql/client',
    'drizzle-orm'
  ],
  tsconfig: './tsconfig.json',
  treeshake: true
}) 