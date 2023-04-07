import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const Keycard: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(Keycard);
