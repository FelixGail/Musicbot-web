import { useResource, RequestError, Resource, RequestDispatcher, Request } from 'react-request-hook';
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

function useGenericLogin<T extends Request>(
	loginFunction: (...args: any[]) => RequestConfig<Token>
): [CallResult, RequestDispatcher<T>] {
	const [ { data, error, isLoading }, login ] = useResource(getHookRequest(loginFunction));
	const [ success, setSuccess ] = useState<boolean>(false);
	const { configuration, setConfiguration } = useContext(ConfigurationContext);
	const [ fetchUserResult, fetchUser ] = useUserFetch();
	const configurationRef = useRef(configuration);

	useEffect(
		() => {
			configurationRef.current = configuration;
		},
		[ configurationRef, configuration ]
	);

	useEffect(
		() => {
			if (data && !isLoading) {
				setConfiguration({ loggedIn: true, token: { ...configurationRef.current.token, ...data } });
				configurationRef.current.axios.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
				if (data.refreshToken) {
					localStorage.setItem(configurationRef.current.instance!.domain, data.refreshToken);
				}
				fetchUser();
			}
		},
		[ data, isLoading, configurationRef, setConfiguration, fetchUser ]
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
	const [ success, setSuccess ] = useState<boolean>(false);
	const [ passwordState, setStatePassword ] = useState<string>();
	const { configuration } = useContext(ConfigurationContext);

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
				configuration.token = data;
				setSuccess(true);
			}
		},
		[ data, isLoading, setSuccess, configuration, passwordState ]
	);

	return [ { successful: success, isLoading, error }, callFunction ];
}
