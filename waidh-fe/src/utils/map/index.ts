import { MapKey, SoundKey } from './../key'
import ForestData from './forest'
import StreetData from './street'

export type MapDataShape = {
	dimensions: {
		height: number
		width: number
	}
	image: string
	platform: {
		ground: {
			dimensions: {
				height: number
				width: number
			}
			image: string
			key: string
		}
		others?: Array<{
			dimensions: {
				height: number
				width: number
			}
			x: Array<number>
			y: Array<number>
			image: string
			key: string
		}>
	}
	portals: {
		[key: number]: {
			x: number
			y: number
			spawnOffset: number
			to: {
				scene: MapKey
				map: MapDataShape
				portal: number
			}
		}
	}
	spawn: {
		x: number
		y: number
	}
	sound: SoundKey
	key: MapKey
}

const MapData: Record<MapKey, MapDataShape> = {
	[MapKey.FOREST]: ForestData,
	[MapKey.STREET]: StreetData,
}

export default MapData
