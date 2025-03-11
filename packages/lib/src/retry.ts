export async function retry(operation, times) {
  try {
    return await operation();
  } catch (e) {
    if (times - 1 > 0) {
      console.log(`Retrying... Attempts left: ${times - 1}`);
      return retry(operation, times - 1);
    } else {
      throw e;
    }
  }
}
export async function withRetry(operation, maxAttempts = 5, delay = 1000) {
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
