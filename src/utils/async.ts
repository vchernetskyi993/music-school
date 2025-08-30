export async function delay(millis: number) {
  await new Promise<void>((resolve) => setTimeout(resolve, millis));
}
