import { GetStaticProps, NextPage } from "next";
import ErrorPage from "~/components/ErrorPage";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import Turnstile from "react-turnstile";
import { useQuery } from "@tanstack/react-query";

interface IPAPIResponse {
  query: string;
  status: string;
  continent: string;
  continentCode: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  district: string;
  zip: string;
  timezone: string;
  currency: string;
  isp: string;
  org: string;
  as: "AS7029 Windstream Communications LLC";
  asname: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
}

const Verification: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading: sessionLoading } = api.sessions.fetch.useQuery({
    sessionId: id,
  });
  const { isError, error, isSuccess, mutate } =
    api.sessions.verify.useMutation();

  const { data: ipInfo } = useQuery({
    queryKey: ["ipInfo"],
    queryFn: () => fetch("/api/ip").then((res) => res.json()),
  });

  if (sessionLoading) return <>loading</>;

  if (!data)
    return <ErrorPage code={404} description={"Invalid session token"} />;

  const verify = (token: string) => {
    const { query: ip } = ipInfo as IPAPIResponse;

    if (!ip) return;

    mutate({
      captchaToken: token,
      sessionId: id,
      ip,
    });
  };

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const Text = () => {
    if (isSuccess)
      return <p className="py-3 text-xl">You may now return back to Discord</p>;

    if (isError) return <p className="py-3 text-xl">{error.message}</p>;

    return (
      <p className="py-3 text-xl">Making sure you&apos;re a good person...</p>
    );
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col text-center">
          <h1 className="text-4xl font-bold">Keycard Verification</h1>
          <Text />
          {isError ? <></> : <Turnstile sitekey={siteKey} onVerify={verify} />}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.sessions.fetch.prefetch({ sessionId: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default Verification;
