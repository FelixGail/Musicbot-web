import { Song, NamedPlugin } from '../types';
import { db } from './AppDB';

export const fromSong = (song: Song) => {
	const ls = new LikedSong(song.id, song.title, song.description, song.provider.id, song.duration, song.albumArtUrl, song.albumArtPath)
	ls.setProvider(song.provider)
	return ls;
}

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

	setProvider(provider: NamedPlugin) {
		this.providerId = provider.id
		this.provider = provider;
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
			this.providerId = await db.provider.put(this.provider, this.id)

			await db.songs.put(new LikedSong(this.id, this.title, this.description, this.providerId, this.duration, this.albumArtUrl, this.albumArtPath))
		})
	}
}
