import { Song, NamedPlugin } from '../types';
import { db } from './AppDB';

export class LikedSong implements Song {
	id: string;
	provider!: NamedPlugin;
	providerId?: string;
	title: string;
	description: string;
	duration?: number;
	albumArtUrl?: string;
	albumArtPath?: string;

	constructor(
		id: string,
		title: string,
		description: string,
		providerId?: string,
		duration?: number,
		albumArtUrl?: string,
		albumArtPath?: string
	) {
		this.id = id;
		this.providerId = providerId;
		this.title = title;
		this.description = description;
		this.duration = duration;
		this.albumArtUrl = albumArtUrl;
		this.albumArtPath = albumArtPath;
	}

	async loadNavigationProperties() {
		const provider = await db.provider.where('id').equals(this.providerId!).first()
		if(provider) {
			this.provider = provider
		} else {
			throw new Error(`no provider found for song ${this.id}`)
		}
		
	}
	
	save() {
		return db.transaction('rw', db.songs, db.provider, async() => {
			this.providerId = await db.provider.put(this.provider)

			await db.songs.put(this)
		})
	}
}
