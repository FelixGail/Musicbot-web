import { useResource, RequestError, RequestDispatcher, Request } from 'react-request-hook';
import api, { getHookRequest, RequestConfig } from '../api/model';
import { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ConfigurationContext } from '../context/Configuration';
import { Canceler } from 'axios';
import { Token, TokenWithRefresh } from '../types';

export interface CallResult {
	successful: boolean;
	isLoading: boolean;
	error?: RequestError;
}

function useSaveToken(): (token: Token) => void {
	const { configuration, setConfiguration } = useContext(ConfigurationContext);
	const configurationRef = useRef(configuration);

	useEffect(
		() => {
			configurationRef.current = configuration;
		},
		[ configuration, configurationRef ]
	);

	const callback = useCallback(
		(token: Token) => {
			setConfiguration({ loggedIn: true, token: { ...configurationRef.current.token, ...token } });
			configurationRef.current.axios.defaults.headers.Authorization = `Bearer ${token.accessToken}`;
			if (token.refreshToken) {
				localStorage.setItem(configurationRef.current.instance!.domain, token.refreshToken);
			}
		},
		[ configurationRef, setConfiguration ]
	);

	return callback;
}

function useGenericLogin<T extends Request>(
	loginFunction: (...args: any[]) => RequestConfig<Token>
): [CallResult, RequestDispatcher<T>] {
	const [ { data, error, isLoading }, login ] = useResource(getHookRequest(loginFunction));
	const [ success, setSuccess ] = useState<boolean>(false);
	const { setConfiguration } = useContext(ConfigurationContext);
	const [ fetchUserResult, fetchUser ] = useUserFetch();
	const saveToken = useSaveToken();

	useEffect(
		() => {
			if (data && !isLoading) {
				saveToken(data);
				fetchUser();
			}
		},
		[ data, isLoading, saveToken, setConfiguration, fetchUser ]
	);

	useEffect(
		() => {
			if (fetchUserResult.successful) {
				setSuccess(true);
			}
		},
		[ fetchUserResult, setSuccess ]
	);

	return [
		{
			successful: success,
			isLoading: isLoading || fetchUserResult.isLoading,
			error: error || fetchUserResult.error
		},
		login
	];
}

export function useUserRegister(): [CallResult, (username: string, passowrd?: string) => Canceler] {
	const [ callresult, genericCall ] = useGenericLogin(api.registerUser);
	const call = useCallback(
		(username: string, userId?: string) => {
			const password = userId || uuidv4();
			return genericCall(username, password);
		},
		[ genericCall ]
	);
	return [ callresult, call ];
}

export function useUserLogin(): [CallResult, (username: string, password: string) => Canceler] {
	return useGenericLogin(api.loginUser);
}

export function useUserRefresh(): [CallResult, (token: TokenWithRefresh) => Canceler] {
	return useGenericLogin(api.refreshUser);
}

export function useUserFetch(): [CallResult, () => Canceler] {
	const [ { data, error, isLoading }, getUser ] = useResource(getHookRequest(api.getMe));
	const [ success, setSuccess ] = useState<boolean>(false);
	const { setConfiguration } = useContext(ConfigurationContext);

	useEffect(
		() => {
			if (data && !isLoading) {
				setConfiguration({ username: data.name, permissions: data.permissions });
				localStorage.setItem('username', data.name);
				setSuccess(true);
			}
		},
		[ data, isLoading, setSuccess, setConfiguration ]
	);

	return [ { successful: success, isLoading, error }, getUser ];
}

export function useUserSetPassword(): [CallResult, (password: string) => Canceler] {
	const [ { data, error, isLoading }, setPassword ] = useResource(getHookRequest(api.setPassword));
	const [ result, fetchUser ] = useUserFetch();
	const [ passwordState, setStatePassword ] = useState<string>();
	const saveToken = useSaveToken();

	const callFunction = useCallback(
		(password: string) => {
			setStatePassword(password);
			return setPassword(password);
		},
		[ setPassword, setStatePassword ]
	);

	useEffect(
		() => {
			if (data && !isLoading) {
				saveToken(data);
				fetchUser();
			}
		},
		[ data, isLoading, fetchUser, saveToken, passwordState ]
	);

	return [
		{ successful: result.successful, isLoading: isLoading || result.isLoading, error: error || result.error },
		callFunction
	];
}

export function useUserLogout(): () => void {
	const { configuration, setConfiguration } = useContext(ConfigurationContext);
	const confRef = useRef(configuration);
	const returnFunction = useCallback(
		() => {
			setConfiguration({ loggedIn: false, token: undefined });
			if (confRef.current.instance) {
				localStorage.removeItem(confRef.current.instance.domain);
			}
		},
		[ confRef, setConfiguration ]
	);
	return returnFunction;
}

export function useUserDelete(): () => void {
	const [ , deleteUser ] = useResource(api.deleteUser);
	const logoutUser = useUserLogout();

	const callback = useCallback(
		() => {
			deleteUser();
			logoutUser();
		},
		[ deleteUser, logoutUser ]
	);

	return callback;
}
