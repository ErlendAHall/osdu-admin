export async function getEntityRecord<T>(kind: string): Promise<T> {
  console.log("Fetching " + kind);
  return new Promise((resolve) => {
    setTimeout(async () => {
      const response = await fetch("../assets/BHARun2.0.0.Vals.json");
      const payload = (await response.json()) as T;
      resolve(payload);
    }, 2000);
  });
}
