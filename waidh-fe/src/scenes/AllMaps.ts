import { Map } from './Map'
import { MapKey } from '../utils/key'

export class Forest extends Map {
	constructor() {
		super(MapKey.FOREST)
	}
}

export class Street extends Map {
	constructor() {
		super(MapKey.STREET)
	}
}

