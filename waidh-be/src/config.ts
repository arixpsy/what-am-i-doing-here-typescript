import { Environment } from './utils/constants'

export const CORS_ORIGIN: Record<Environment, Array<string>> = {
	[Environment.DEV]: ["http://localhost:8080"],
	[Environment.PROD]: [],
}
