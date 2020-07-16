import Dexie from 'dexie';
import { LikedSong } from './LikedSong';
import { NamedPlugin } from '../types';

export class AppDB extends Dexie {
	songs: Dexie.Table<LikedSong, string>;
	provider: Dexie.Table<NamedPlugin, string>;

	constructor() {
		super('AppDB');

		this.version(1).stores({
			songs: 'id, title, description, providerId, duration, albumArtUrl, albumArtPath',
			provider: 'id, name'
		});

		this.songs = this.table('songs');
		this.provider = this.table('provider');

		this.songs.mapToClass(LikedSong);
	}
}

export const db = new AppDB();
