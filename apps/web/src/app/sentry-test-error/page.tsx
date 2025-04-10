export const dynamic = "force-dynamic";
export default async function SentryTestError() {
  async function throwServerErrror() {
    "use server";
    throw new Error(
      `This is a test error for Sentry thrown at ${new Date().toISOString()}`,
    );
  }
  return (
    <form action={throwServerErrror}>
      <button type="submit" className="p-3 m-3 bg-green-400">
        {" "}
        Fehler schmeißen
      </button>
    </form>
  );
}
