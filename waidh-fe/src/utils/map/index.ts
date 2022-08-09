import { MapKey, SoundKey } from './../key'
import ForestData from './forest'
import StreetData from './street'

export type PortalData = {
	x: number
	y: number
	spawnOffset: number
	to: {
		mapKey: MapKey
		map: () => MapDataShape
		portal: number
	}
}

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
			x: Array<number> | number
			y: Array<number> | number
			image: string
			key: string
		}>
	}
	portals: Record<number, PortalData>
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
