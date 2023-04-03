import { type AppType } from "next/app";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const privatePages: Array<string> = ["/panel"];

const MyApp: AppType = ({ Component, pageProps }) => {
  // Get the pathname
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPrivate = privatePages.includes(pathname);

  const Authenticated = () => {
    return (
      <>
        <SignedIn>
          <Component {...pageProps} />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    );
  };

  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
      }}
    >
      {isPrivate ? <Authenticated /> : <Component {...pageProps} />}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
