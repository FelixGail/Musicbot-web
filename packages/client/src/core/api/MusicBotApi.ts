import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosError,
  AxiosResponse
} from "axios";
import {
  VersionInfo,
  Credentials,
  UserInfo,
  PlayerState,
  Action as PlayerAction,
  NamedPlugin,
  Song,
  QueueEntry
} from "../types";
import { setCryptoInterface, ICBINTCryptography } from "icbint";
const uuidv4 = require("uuid/v4");

const apiPath = "/api";

setCryptoInterface(crypto);

export class MusicBotApi {
  private axiosConfig: AxiosRequestConfig;
  private axiosInstance: AxiosInstance;
  private loggedIn: boolean = false;
  credentials?: Credentials;
  publicKey?: string =
    "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDD0tPV/du2vftjvXj1t/gXTK39sNBVrOAEb/jKzXae+Xa0H+3LhZaQIQNMfACiBSgIfZUvEGb+7TqXWQpoLoFR/R7MvGWcSk98JyrVtveD8ZmZYyItSY7m2hcasqAFiKyOouV5vzyRe87/lEyzzBpF3bQQ4IDaQu+K9Hj5fKuU6rrOeOhsdnJc+VdDQLScHxvMoLZ9Vtt+oK9J4/tOLwr4CG8khDlBURcBY6gPcLo3dPU09SW+6ctX2cX4mkXx6O/0mmdTmacr/vu50KdRMleFeZYOWPAEhhMfywybTuzBiPVIZVP8WFCSKNMbfi1S9A9PdBqnebwwHhX3/hsEBt2BAgMBAAECggEABEI1P6nf6Zs7mJlyBDv+Pfl5rjL2cOqLy6TovvZVblMkCPpJyFuNIPDK2tK2i897ZaXfhPDBIKmllM2Hq6jZQKB110OAnTPDg0JxzMiIHPs32S1d/KilHjGff4Hjd4NXp1l1Dp8BUPOllorR2TYm2x6dcCGFw9lhTr8O03Qp4hjn84VjGIWADYCk83mgS4nRsnHkdiqYnWx1AjKlY51yEK6RcrDMi0Th2RXrrINoC35sVv+APt2rkoMGi52RwTEseA1KZGFrxjq61ReJif6p2VXEcvHeX6CWLx014LGk43z6Q28P6HgeEVEfIjyqCUea5Du/mYb/QsRSCosXLxBqwQKBgQD1+fdC9ZiMrVI+km7Nx2CKBn8rJrDmUh5SbXn2MYJdrUd8bYNnZkCgKMgxVXsvJrbmVOrby2txOiqudZkk5mD3E5O/QZWPWQLgRu8ueYNpobAX9NRgNfZ7rZD+81vh5MfZiXfuZOuzv29iZhU0oqyZ9y75eHkLdrerNkwYOe5aUQKBgQDLzapDi1NxkBgsj9iiO4KUa7jvD4JjRqFy4Zhj/jbQvlvM0F/uFp7sxVcHGx4r11C+6iCbhX4u+Zuu0HGjT4d+hNXmgGyxR8fIUVxOlOtDkVJa5sOBZK73/9/MBeKusdmJPRhalZQfMUJRWIoEVDMhfg3tW/rBj5RYAtP2dTVUMQKBgDs8yr52dRmT+BWXoFWwaWB0NhYHSFz/c8v4D4Ip5DJ5M5kUqquxJWksySGQa40sbqnD05fBQovPLU48hfgr/zghn9hUjBcsoZOvoZR4sRw0UztBvA+7jzOz1hKAOyWIulR6Vca0yUrNlJ6G5R56+sRNkiOETupi2dLCzcqb0PoxAoGAZyNHvTLvIZN4iGSrjz5qkM4LIwBIThFadxbv1fq6pt0O/BGf2o+cEdq0diYlGK64cEVwBwSBnSg4vzlBqRIAUejLjwEDAJyA4EE8Y5A9l04dzV7nJb5cRak6CrgXxay/mBJRFtaHxVlaZGxYPGSYE6UFS0+3EOmmevvDZQBf4qECgYEA0ZF6Vavz28+8wLO6SP3w8NmpHk7K9tGEvUfQ30SgDx4G7qPIgfPrbB4OP/E0qCfsIImi3sCPpjvUMQdVVZyPOIMuB+rV3ZOxkrzxEUOrpOpR48FZbL7RN90yRQsAsrp9e4iv8QwB3VxLe7X0TDqqnRyqrc/osGzuS2ZcHOKmCU8==";
  private cancelToken = axios.CancelToken.source();

  constructor() {
    this.axiosConfig = {
      timeout: 1000,
      baseURL: apiPath,
      cancelToken: this.cancelToken.token
    };
    this.axiosInstance = axios.create();
    this.axiosInstance.defaults = {
      ...this.axiosInstance.defaults,
      ...this.axiosConfig
    };
  }

  async loginUser(username: string, password: string): Promise<String> {
    const response = await axios.get("/token", {
      ...this.axiosConfig,
      headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` }
    });
    this.afterLogin(username, password, response.data);
    return response.data;
  }

  async registerUser(username: string, userId: string): Promise<String> {
    const response = await axios.post(
      "/user",
      {
        name: username,
        userId: userId
      },
      this.axiosConfig
    );
    this.afterLogin(username, userId, response.data);
    return response.data;
  }

  async login(username: string, password?: string): Promise<Credentials> {
    if (!password) {
      const uuid = uuidv4();
      await this.registerUser(username, uuid);
    } else {
      await this.loginUser(username, password);
    }
    return this.credentials!;
  }

  async getVersion(): Promise<VersionInfo> {
    const response = await axios.get("/version", this.axiosConfig);
    return response.data;
  }

  async getKey(): Promise<String> {
    const response = await axios.get<string>("/key", this.axiosConfig);
    const publicKey = response.data.trim();
    this.publicKey = publicKey;
    const icbintCrypto = new ICBINTCryptography();
    console.debug("Adding icbint interceptors");
    icbintCrypto.initialize(publicKey);
    this.axiosInstance.interceptors.request.use(request => {
      return { ...request, ...icbintCrypto.encrypt(request) };
    });
    this.axiosInstance.interceptors.response.use(response => {
      return { ...response, ...icbintCrypto.decrypt(response) };
    });
    return publicKey;
  }

  getMe(): Retryable<UserInfo> {
    return new Retryable(this, this.axiosInstance.get<UserInfo>("/user"));
  }

  getPlayerState(): Retryable<PlayerState> {
    return new Retryable(this, this.axiosInstance.get<PlayerState>("/player"));
  }

  setPlayerState(action: PlayerAction): Retryable<PlayerState> {
    return new Retryable(
      this,
      this.axiosInstance.put<PlayerState>("/player", {
        action: action
      })
    );
  }

  getProviders(): Retryable<NamedPlugin[]> {
    return new Retryable(
      this,
      this.axiosInstance.get<NamedPlugin[]>("/provider")
    );
  }

  searchSongs(
    provider: NamedPlugin,
    query: string,
    limit?: number,
    offset?: number
  ): Retryable<Song[]> {
    return new Retryable(
      this,
      this.axiosInstance.get<Song[]>(`/provider/${provider.id}`, {
        params: {
          query: query,
          limit: limit,
          offset: offset
        }
      })
    );
  }

  cancel() {
    this.cancelToken.cancel();
  }

  lookupSong(provider: NamedPlugin, songID: string): Retryable<Song> {
    return new Retryable(
      this,
      this.axiosInstance.get<Song>(`/provider/${provider.id}/${songID}`)
    );
  }

  enqueue(song: Song): Retryable<QueueEntry[]> {
    return new Retryable(
      this,
      this.axiosInstance.put<QueueEntry[]>("/player/queue", undefined, {
        params: {
          songId: song.id,
          providerId: song.provider.id
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setCredentials(username: string, password: string) {
    this.credentials = { username: username, password: password, token: "" };
  }

  private afterLogin(username: string, password: string, token: string) {
    this.setCredentials(username, password);
    this.setBearerHeader(token);
    this.loggedIn = true;
  }

  private setBearerHeader(token: string) {
    this.axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

class Retryable<P> {
  private instance: MusicBotApi;
  private call: Promise<AxiosResponse<P>>;

  constructor(instance: MusicBotApi, call: Promise<AxiosResponse<P>>) {
    this.instance = instance;
    this.call = call;
  }

  async get(): Promise<P> {
    const response = await this.call;
    return response.data;
  }

  async getWithRetry(): Promise<P> {
    return this.get().catch(async (error: AxiosError<P>) => {
      if (
        error.response &&
        error.config &&
        error.response.status === 401 &&
        this.instance.credentials
      ) {
        const token = await this.instance.loginUser(
          this.instance.credentials.username,
          this.instance.credentials.password
        );
        error.config.headers.Authorization = `Bearer ${token}`;
        const response = await axios.request<P>(error.config);
        return response.data;
      }
      return Promise.reject(error);
    });
  }
}
