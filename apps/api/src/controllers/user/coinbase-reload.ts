import express, { Request, Response } from "express";
import { User } from "../../models/user";
import { ExpressRequestWithAuth } from "@clerk/express";

if (!process.env.COINBASE_API_KEY) {
  throw new Error("COINBASE_API_KEY environment variable is not set");
}

async function coinbaseReload(
  req: ExpressRequestWithAuth | Request,
  res: Response
) {
  const auth = (req as ExpressRequestWithAuth).auth;
  const userId = auth.userId;
  const body = req.body;

  try {
    // // Prepare the payload for the Coinbase Commerce API
    // const payload = {
    //   name: `$${body.amount} Reload`,
    //   description: "Balance reload",
    //   pricing_type: "fixed_price",
    //   local_price: {
    //     amount: body.amount,
    //     currency: "USD",
    //   },
    // };

    // // Make a POST request to the Coinbase Commerce API
    // const response = await fetch(
    //   "https://api.commerce.coinbase.com/charges/",
    //   {
    //     method: "POST",
    //     body: JSON.stringify(payload),
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-CC-Api-Key": process.env.COINBASE_API_KEY,
    //     },
    //   }
    // );

    // // Extract the session URL from the response
    // const session = response.data.hosted_url;

    // Return the session URL to the client
    return res.json({ session: "" });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Error creating coinbase reload balance url" });
  }
}

export { coinbaseReload };
