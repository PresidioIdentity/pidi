/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly KEY_SECRET_128: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
