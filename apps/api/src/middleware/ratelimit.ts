

import { rateLimit } from "express-rate-limit";

export const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 250,
  standardHeaders: "draft-6", // Use draft-6 headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  // Custom handler for rate limit exceeded
  handler: (req, res, next, options) => {
    const retryAfter = options.windowMs - (Date.now() % options.windowMs);
    // Prepare a message with the retry-after time in minutes and seconds
    const retryAfterSeconds = Math.ceil(retryAfter / 1000); // Convert milliseconds to seconds
    const message = `Rate limit exceeded. Try again in ${Math.floor(
      retryAfterSeconds / 60
    )} minutes and ${retryAfterSeconds % 60} seconds.`;
    res.status(429).send(message);
  },
});
