import { useContext } from 'react';
import { ControllerContext } from './controller';

export function useTransport() {
  return useContext(ControllerContext).transport;
}