import { MapDataShape } from '.'
import { MapKey, SoundKey } from '../key'
import ForestBG from './../../assets/backgrounds/forest.png'
import ForestPlatform from './../../assets/platforms/1024x110.png'
import StreetData from './street'

const ForestData: MapDataShape = {
	dimensions: {
		height: 560,
		width: 1024,
	},
	image: ForestBG,
	platform: {
		ground: {
			dimensions: {
				height: 100,
				width: 1024,
			},
			image: ForestPlatform,
			key: 'FOREST_PLATFORM',
		},
	},
	spawn: {
		x: 512,
		y: 300,
	},
	portals: {
		1: {
			x: 940,
			y: 512,
			spawnOffset: 7,
			to: {
				mapKey: MapKey.STREET,
				map: () => StreetData,
				portal: 1,
			},
		},
		2: {
			x: 75,
			y: 512,
			spawnOffset: 7,
			to: {
				// TODO: Change THIEF TOWN
				mapKey: MapKey.STREET,
				map: () => StreetData,
				portal: 1,
			},
		},
	},
	sound: SoundKey.MY_PRINCE_MY_KINGDOM,
	key: MapKey.FOREST,
}

export default ForestData
