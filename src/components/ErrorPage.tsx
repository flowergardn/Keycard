import Link from "next/link";

const ErrorPage = (props: { code: number; description: string }) => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col text-center">
        <h1 className="text-5xl font-bold">{props.code}</h1>
        <p className="py-3 text-2xl">{props.description}</p>
        <Link href="/" passHref legacyBehavior>
          <button className="btn-error btn rounded-md normal-case">
            Go home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
