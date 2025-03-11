import express, { Request, Response } from "express";
import { User } from "../../models/user";
import { ExpressRequestWithAuth } from "@clerk/express";

if (!process.env.HELIO_PUBLIC_API_KEY || !process.env.HELIO_SECRET_API_KEY) {
  throw new Error(
    "HELIO_PUBLIC_API_KEY and HELIO_SECRET_API_KEY environment variables are not set"
  );
}

async function helioReload(
  req: ExpressRequestWithAuth | Request,
  res: Response
) {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const body = req.body;

  const SECRET_API_KEY = process.env.HELIO_SECRET_API_KEY;
  const PUBLIC_API_KEY = process.env.HELIO_PUBLIC_API_KEY;

  try {
    const response = await fetch(
      "https://api.hel.io/v1/paylink/create/api-key?apiKey=" + PUBLIC_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HELIO_SECRET_API_KEY}`,
        },

        body: JSON.stringify({
          template: "OTHER", // Important that this is capitalized
          name: `$${body.amount} Balance Reload`,
          description: userId,
          price:
            body.amount *
            1000000 /* price is int64 represented by the base units of each currency, e.g. "price": "1000000" = 1 USDC*/,
          pricingCurrency: "6340313846e4f91b8abc519b", // To get currency IDs, see the /get-currencies endpoint
          features: {
            requireMaxTransactions: true,
          },
          maxTransactions: 1,
          recipients: [
            {
              walletId: "679d87b06030013eddd5611b", // Change this to your wallet id
              currencyId: "6340313846e4f91b8abc519b", // To get currency IDs, see the /get-currencies endpoint
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`${errorData.code} ${errorData.message}`);
      return res
        .status(response.status)
        .json({ message: errorData.message || "Error creating Helio paylink" });
    }

    const result = await response.json();
    const paylinkUrl = `https://hel.io/pay/${result.id}`;
    console.log(paylinkUrl);
    const session = paylinkUrl;
    return res.json({ session });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating Helio reload balance URL" });
  }
}

export { helioReload };
