import { reactive } from 'vue';
import { io } from 'socket.io-client';

export const state = reactive({
  connected: false,
});

const URL = process.env.NODE_ENV === 'production' ? undefined : process.env.VITE_API_HOST;

export const socket = io(URL, {
  autoConnect: false,
});

socket.on('connect', () => {
  state.connected = true;
});

socket.on('disconnect', () => {
  state.connected = false;
});
