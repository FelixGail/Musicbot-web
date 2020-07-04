import { BotInstance, VersionInfo } from './types';
import Axios from 'axios';
import api from './api/model';

export async function isInstanceAvailable(instance: BotInstance) {
	return Axios.get<VersionInfo>(`https://${instance.domain}:${instance.port}`, api.getVersion()).then(
		(value) => true,
		(reason) => false
	);
}
