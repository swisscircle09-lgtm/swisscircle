const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, consent } = req.body;

  if (!email || !consent) {
    return res.status(400).json({ error: 'Email and consent are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const msg = {
    to: email,
    from: {
      email: 'noreply@swisscircle.trade',
      name: 'Swiss Circle',
    },
    subject: 'Your SC Trading Guide is ready',
    html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>SC Trading Guide</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0!important; padding:0!important; background-color:#07090D!important; }
  @media (prefers-color-scheme: dark) {
    body, .email-wrap { background-color:#07090D!important; }
  }
</style>
</head>
<body bgcolor="#07090D" style="margin:0;padding:0;background-color:#07090D;-webkit-text-size-adjust:100%;mso-line-height-rule:exactly;">

<!-- Outer wrapper -->
<table class="email-wrap" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#07090D"
  style="background-color:#07090D;border-collapse:collapse;">
  <tr>
    <td align="center" style="padding:40px 16px;">

      <!-- Card -->
      <table width="560" cellpadding="0" cellspacing="0" border="0"
        style="max-width:560px;width:100%;border-collapse:collapse;">

        <!-- TOP GOLD LINE -->
        <tr>
          <td bgcolor="#C9A84C" height="3" style="height:3px;font-size:1px;line-height:1px;background-color:#C9A84C;">&nbsp;</td>
        </tr>

        <!-- HEADER -->
        <tr>
          <td bgcolor="#0B0E14" align="center"
            style="background-color:#0B0E14;padding:44px 40px 36px;border-left:1px solid #1E1A10;border-right:1px solid #1E1A10;">
            <!-- Eyebrow -->
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:10px;
              font-weight:700;letter-spacing:0.45em;color:#C9A84C;text-transform:uppercase;">
              Swiss Circle
            </p>
            <!-- Divider line -->
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
              <tr><td bgcolor="#C9A84C" width="50" height="1" style="height:1px;font-size:1px;line-height:1px;">&nbsp;</td></tr>
            </table>
            <!-- Title -->
            <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:32px;
              font-weight:800;letter-spacing:0.08em;color:#F0E8D0;text-transform:uppercase;
              line-height:1.1;">
              THE TRADING<br>GUIDE
            </h1>
            <p style="margin:14px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:13px;
              font-style:italic;color:#8A7A55;letter-spacing:0.04em;">
              A Complete Introduction to Crypto Trading
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td bgcolor="#0D1018" style="background-color:#0D1018;padding:36px 40px;
            border-left:1px solid #1E1A10;border-right:1px solid #1E1A10;">
            <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;
              line-height:1.75;color:#C8B98A;">
              Your free copy of the SC Trading Guide is ready. Click the button below to download your PDF.
            </p>

            <!-- CTA BUTTON -->
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
              <tr>
                <td bgcolor="#C9A84C" style="background-color:#C9A84C;border-radius:3px;">
                  <a href="https://www.swisscircle.trade/trading-book.pdf"
                    style="display:inline-block;padding:15px 38px;font-family:Arial,Helvetica,sans-serif;
                    font-size:12px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;
                    color:#07090D;text-decoration:none;">
                    Download Your Guide
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;
              line-height:1.75;color:#5A5040;">
              34 pages covering crypto fundamentals — chart reading, risk management, trading psychology, and building a consistent edge.
            </p>

            <!-- DIVIDER -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:24px;">
              <tr><td bgcolor="#1E1A10" height="1" style="height:1px;font-size:1px;line-height:1px;">&nbsp;</td></tr>
            </table>

            <!-- UPSELL -->
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;
              line-height:1.7;color:#4A4030;">
              Ready to trade alongside professional traders?&nbsp;
              <a href="https://www.swisscircle.trade/#pricing"
                style="color:#C9A84C;text-decoration:none;font-weight:700;">
                Join Swiss Circle &rarr;
              </a>
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#09090D" align="center"
            style="background-color:#09090D;padding:20px 40px;
            border:1px solid #1E1A10;border-top:none;border-radius:0 0 4px 4px;">
            <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:10px;
              letter-spacing:0.18em;color:#8A7040;text-transform:uppercase;">
              &copy; 2026 Swiss Circle &nbsp;&middot;&nbsp; swisscircle.trade
            </p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#8A7040;">
              You received this because you requested the SC Trading Guide.&nbsp;
              <a href="https://www.swisscircle.trade/privacy.html"
                style="color:#C9A84C;text-decoration:none;">Privacy Policy</a>
              &nbsp;&middot;&nbsp;
              <a href="https://www.swisscircle.trade/api/unsubscribe?email=${encodeURIComponent(email)}"
                style="color:#C9A84C;text-decoration:none;">Unsubscribe</a>
            </p>
          </td>
        </tr>

        <!-- BOTTOM GOLD LINE -->
        <tr>
          <td bgcolor="#C9A84C" height="2" style="height:2px;font-size:1px;line-height:1px;background-color:#C9A84C;">&nbsp;</td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  };

  try {
    // Send the guide email
    await sgMail.send(msg);

    // Save contact to SendGrid Marketing list
    // Fails silently — don't block delivery if this errors
    try {
      const contactPayload = JSON.stringify({
        contacts: [{ email }],
        list_ids: process.env.SENDGRID_LIST_ID ? [process.env.SENDGRID_LIST_ID] : undefined,
      });
      await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: contactPayload,
      });
    } catch (contactErr) {
      console.error('SendGrid contact save error:', contactErr.message);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('SendGrid error:', err?.response?.body || err.message);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}
