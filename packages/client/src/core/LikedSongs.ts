import { Song } from "./types";

const storageKey = "likedSongs";

class LikedSongs {
  private songs: Array<Song>;

  constructor() {
    const songString = localStorage.getItem(storageKey);
    if (songString) {
      this.songs = JSON.parse(songString);
    } else {
      this.songs = [];
    }
  }

  addSong(song: Song): void {
    if (!this.contains(song)) {
      this.songs.push(song);
      this.save();
    }
  }

  removeSong(song: Song): void {
    this.songs = this.songs.filter(
      item => item.id !== song.id || item.provider.id !== song.provider.id
    );
    this.save();
  }

  contains(song: Song): boolean {
    for (let item of this.songs) {
      if (item.id === song.id && item.provider.id === song.provider.id) {
        return true;
      }
    }
    return false;
  }

  private save() {
    localStorage.setItem(storageKey, JSON.stringify(this.songs));
  }
}

export default LikedSongs;
