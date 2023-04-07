import { type NextPage } from "next";
import Head from "next/head";

let defaults = {
  title: "Keycard",
  description: "A new era of Discord verification",
  color: "#7ec8e3",
};

function Meta({
  title = defaults.title,
  description = defaults.description,
  color = defaults.color,
}) {
  const url = "keycard.vercel.app";

  return (
    <>
      <meta name="description" content={description ?? defaults.description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="theme-color" content={color ?? defaults.color} />
      <meta property="og:title" content={title ?? defaults.title} />
      <meta
        property="og:description"
        content={description ?? defaults.description}
      />
      <meta property="twitter:domain" content={url} />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title ?? defaults.title} />
      <meta
        name="twitter:description"
        content={description ?? defaults.description}
      />
      <link rel="icon" href="/favicon.ico" />
      <title>Keycard</title>
    </>
  );
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <Meta />
      </Head>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content animate-fadeInUp flex-col lg:flex-row">
          <div>
            <h1 className="select-none text-5xl font-bold">Keycard</h1>
            <p className="select-none py-6">
              Simple, effective & modernized Discord verification.
            </p>
            <button
              className="btn normal-case text-slate-200 transition duration-300 ease-in"
              onClick={() => {
                window.location.href = "https://github.com/astridlol/Keycard";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>
            <button
              className="btn ml-4 normal-case text-slate-200 transition duration-300 ease-in"
              onClick={() => {
                window.location.href = "/api/invite";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 15l6 -6"></path>
                <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path>
                <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
