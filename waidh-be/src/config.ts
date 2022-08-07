import { ENVIRONMENT } from './utils/constants'

export const CORS_ORIGIN: Record<ENVIRONMENT, Array<string>> = {
	[ENVIRONMENT.DEV]: ["http://localhost:8080"],
	[ENVIRONMENT.PROD]: [],
}
