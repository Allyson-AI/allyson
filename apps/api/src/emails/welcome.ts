
const ZEPTO_API_URL = "https://api.zeptomail.com/v1.1/email";
const ZEPTO_API_KEY = process.env.ZEPTOMAIL_API_KEY;

if (!ZEPTO_API_KEY) {
  throw new Error("ZEPTOMAIL_API_KEY is not defined in environment variables");
}

async function sendWelcomeEmail(
  email: string | undefined,
  firstName: string | undefined = "",
  lastName: string | undefined = ""
): Promise<void> {
  if (!email) {
    console.error("Cannot send welcome email: email is undefined");
    return;
  }

  try {
    const response = await fetch(ZEPTO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Zoho-enczapikey ${ZEPTO_API_KEY}`
      },
      body: JSON.stringify({
        from: {
          address: "isaiah@allyson.ai",
          name: "Isaiah From Allyson"
        },
        to: [
          {
            email_address: {
              address: email,
              name: `${firstName || ""} ${lastName || ""}`.trim()
            }
          }
        ],
        subject: "Welcome to Allyson",
        htmlbody: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
    <link rel="preload" as="image" href="https://allyson.ai/allyson-app-logo.png" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--$-->
</head>
<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Allyson is an AI-powered browser automation tool designed to streamline and automate repetitive tasks efficiently.
</div>

<body style="background-color:rgb(255,255,255);margin-top:auto;margin-bottom:auto;margin-left:auto;margin-right:auto;font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;;padding-left:0.5rem;padding-right:0.5rem">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="border-width:1px;border-style:solid;border-color:rgb(234,234,234);border-radius:0.25rem;margin-top:40px;margin-bottom:40px;margin-left:auto;margin-right:auto;padding:20px;max-width:465px">
        <tbody>
            <tr style="width:100%">
                <td>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top:32px">
                        <tbody>
                            <tr>
                                <td><img alt="Vercel" height="64" src="https://allyson.ai/allyson-app-logo.png" style="margin-top:0px;margin-bottom:0px;margin-left:auto;margin-right:auto;display:block;outline:none;border:none;text-decoration:none" width="64" /></td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 style="color:rgb(0,0,0);font-size:24px;font-weight:400;text-align:center;padding:0px;margin-top:30px;margin-bottom:30px;margin-left:0px;margin-right:0px">Welcome To Allyson</h1>
                    <p style="color:rgb(0,0,0);font-size:14px;line-height:24px;margin:16px 0">Thanks for signing up for Allyson! <br/><br/> We built Allyson to automate online tasks that you do every single day to help free up more time for you. Just ask allyson to handle a task (be specific, the more detail the better), she will work in the background and update you if she needs help in app or via push notifications. Allyson also has access to a file browser so she can read and write to files and save them for you.<br/> <br/>Please let me know if you need anything,<br/>Isaiah Bjorklund <br/> Founder </p>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                        <tbody>
                            <tr>
                                <td>
                                    <a href="https://allyson.ai" style="background-color:rgb(0,0,0);border-radius:0.25rem;color:rgb(255,255,255);font-size:12px;font-weight:600;text-decoration-line:none;text-align:center;padding-left:1.25rem;padding-right:1.25rem;padding-top:0.75rem;padding-bottom:0.75rem;line-height:100%;text-decoration:none;display:block;max-width:100%;margin-bottom:10px;" target="_blank">
                                        <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">View Dashboard</span>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <a href="https://apps.apple.com/us/app/allyson/id6593659141" style="background-color:rgb(0,0,0);border-radius:0.25rem;color:rgb(255,255,255);font-size:12px;font-weight:600;text-decoration-line:none;text-align:center;padding-left:1.25rem;padding-right:1.25rem;padding-top:0.75rem;padding-bottom:0.75rem;line-height:100%;text-decoration:none;display:block;max-width:100%;" target="_blank">
                                        <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Download on iOS</span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr style="border-width:1px;border-style:solid;border-color:rgb(234,234,234);margin-top:26px;margin-bottom:12px;margin-left:0px;margin-right:0px;width:100%;border:none;border-top:1px solid #eaeaea" />
                    <p style="color:rgb(102,102,102);font-size:12px;line-height:24px;margin:16px 0">
                        Allyson, Inc. 8 The Green, STE A, Dover, Delaware 19901<br>
                        <a href="https://app.allyson.ai/settings" style="color:rgb(102,102,102);text-decoration:underline;">Manage Email Preferences or Unsubscribe</a>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
    <!--/$-->
</body>

</html>
      `,
        track_clicks: true,
        track_opens: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}

export { sendWelcomeEmail };
