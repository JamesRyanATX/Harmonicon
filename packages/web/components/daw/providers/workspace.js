import { useContext } from 'react';
import { ControllerContext } from './controller';

export function useWorkspace() {
  return useContext(ControllerContext).workspace;
}