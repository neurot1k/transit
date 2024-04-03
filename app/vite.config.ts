import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import fs from 'fs';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    https: {
      key: fs.readFileSync('../../ssl/privkey.pem'),
      cert: fs.readFileSync('../../ssl/fullchain.pem'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    }
  }
})
