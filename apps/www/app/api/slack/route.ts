export async function POST(request) {
  const response = await request.json();
  try {
    const { name, phone, email, message } = response;
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    try {
      await fetch('https://hooks.slack.com/services/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', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `New contact info:\n- Name: ${name}\n- Phone: ${phone}\n- Email: ${email}\n- Message: ${message}`,
        }),
      });
      return Response.json({ message: "Success" }, { status: 200 });
    } catch (error) {
      return Response.json(
        { message: "Failed to send message to Slack" },
        { status: 500 }
      );
    }
  } catch (error) {
    return Response.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}
