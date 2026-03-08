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
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SC Trading Guide</title>
</head>
<body style="margin:0;padding:0;background:#080A0D;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080A0D;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#080A0D;border:1px solid rgba(201,168,76,0.20);border-radius:8px 8px 0 0;padding:40px 40px 32px;text-align:center;border-bottom:2px solid #C9A84C;">
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:0.4em;color:#C9A84C;text-transform:uppercase;">Swiss Circle</p>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#F8F4EC;letter-spacing:0.05em;">THE TRADING GUIDE</h1>
              <p style="margin:12px 0 0;font-size:13px;color:rgba(200,175,130,0.60);font-style:italic;">A Complete Introduction to Crypto Trading</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#0D1017;border:1px solid rgba(201,168,76,0.12);border-top:none;padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:15px;color:rgba(220,195,140,0.85);line-height:1.7;">
                Your free copy of the SC Trading Guide is ready. Click the button below to download your PDF.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:28px auto;">
                <tr>
                  <td style="background:linear-gradient(135deg,#C9A84C,#F0C84A);border-radius:4px;">
                    <a href="https://www.swisscircle.trade/trading-book.pdf"
                       style="display:inline-block;padding:14px 36px;font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#080A0D;text-decoration:none;">
                      Download Your Guide
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:13px;color:rgba(200,175,130,0.50);line-height:1.7;">
                The guide covers 34 pages of crypto trading fundamentals — from reading charts and managing risk, to trading psychology and building a consistent edge.
              </p>

              <hr style="border:none;border-top:1px solid rgba(201,168,76,0.12);margin:28px 0;">

              <p style="margin:0;font-size:12px;color:rgba(200,175,130,0.40);line-height:1.7;">
                Ready to trade alongside professional traders?<br>
                <a href="https://www.swisscircle.trade/#pricing" style="color:#C9A84C;text-decoration:none;">Join Swiss Circle →</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#080A0D;border:1px solid rgba(201,168,76,0.10);border-top:none;border-radius:0 0 8px 8px;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:10px;letter-spacing:0.15em;color:rgba(200,175,130,0.25);text-transform:uppercase;">
                © 2026 Swiss Circle · swisscircle.trade
              </p>
              <p style="margin:8px 0 0;font-size:10px;color:rgba(200,175,130,0.20);">
                You received this because you requested the SC Trading Guide.<br>
                <a href="https://www.swisscircle.trade/privacy.html" style="color:rgba(200,175,130,0.30);text-decoration:none;">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="mailto:swisscircle09@gmail.com?subject=Unsubscribe" style="color:rgba(200,175,130,0.30);text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('SendGrid error:', err?.response?.body || err.message);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}
