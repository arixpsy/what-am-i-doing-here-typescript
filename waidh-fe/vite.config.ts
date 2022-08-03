import { defineConfig } from 'vite'

export default defineConfig({
	assetsInclude: ['**/*.html'],
	server: {
		port: 8080
	},
	base: './',
	build: {
		assetsInlineLimit: 0
	}
})
