/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
  readonly VITE_EMAILJS_SERVICE_ID: string;
  readonly VITE_EMAILJS_TEMPLATE_CONTACT: string;
  readonly VITE_EMAILJS_TEMPLATE_BENEVOLE: string;
  readonly VITE_HELLOASSO_URL: string;
  readonly VITE_GAS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}
