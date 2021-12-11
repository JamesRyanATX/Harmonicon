import { config as core } from '@composer/core';
import './polyfills';

export const config = {
  core,

  get: (key) => {
    return localStorage.getItem(`harmonicon.${key}`);
  },

  set: (key, value) => {
    localStorage.setItem(`harmonicon.${key}`, value);
  },

  unset: (key) => {
    localStorage.removeItem(key);
  }

}