import { createContext } from "react";
import LikedSongs from "../LikedSongs";

export const LikedSongContext = createContext(new LikedSongs());
