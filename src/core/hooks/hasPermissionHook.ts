import { useContext, useMemo } from 'react';
import { ConfigurationContext } from '../context/Configuration';
import { Permission } from '../types';

function useHasPermission(permission: Permission): boolean {
  const { configuration } = useContext(ConfigurationContext);
  return useMemo(
    () =>
      (configuration.permissions &&
        configuration.permissions.includes(permission)) ||
      false,
    [configuration.permissions, permission],
  );
}

export default useHasPermission;
