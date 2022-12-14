import { MapDataShape } from '.'
import { MapKey, SoundKey } from '../key'
import ForestData from './forest'
import StreetBG from './../../assets/backgrounds/street.gif'
import StreetPlatform from './../../assets/platforms/1234x184.png'
import { Street } from '../../scenes/AllMaps'

const StreetData: MapDataShape = {
	dimensions: {
		height: 638,
		width: 1234,
	},
	image: StreetBG,
	platform: {
		ground: {
			dimensions: {
				height: 184,
				width: 1234,
			},
			image: StreetPlatform,
			key: 'STREET_PLATFORM',
		},
	},
	spawn: {
		x: 512,
		y: 300,
	},
	portals: {
		1: {
			x: 1150,
			y: 550,
			spawnOffset: 7,
			to: {
				mapKey: MapKey.FOREST,
				map: () => ForestData,
				portal: 1,
			},
		},
	},
	sound: SoundKey.CAVA_BIEN,
	key: MapKey.STREET,
	class: Street
}

export default StreetData
