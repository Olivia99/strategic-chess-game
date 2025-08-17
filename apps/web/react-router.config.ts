import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	ssr: false,
	prerender: false,
	buildDirectory: "build",
	serverBuildFile: "index.js",
} satisfies Config;
