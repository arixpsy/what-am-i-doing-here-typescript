import { MapKey } from '../constants'

export const getRoomId = (map: MapKey, channel: number) => `${map}-${channel}`
