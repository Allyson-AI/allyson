export async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 5,
  delay: number = 1000
): Promise<T> {
  let attempt = 1;
  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (attempt < maxAttempts) {
        console.log(`Attempt ${attempt} failed, retrying after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        attempt++;
      } else {
        // Re-throw the error after the last attempt
        throw error;
      }
    }
  }
}
