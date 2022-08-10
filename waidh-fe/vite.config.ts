import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		port: 8080
	},
	base: './',
	build: {
		assetsInlineLimit: 0
	}
})
