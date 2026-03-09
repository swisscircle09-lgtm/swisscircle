module.exports = async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Missing email parameter.');
  }

  const decoded = decodeURIComponent(email);

  try {
    const sgRes = await fetch(`https://api.sendgrid.com/v3/asm/groups/${process.env.SENDGRID_UNSUBSCRIBE_GROUP_ID}/suppressions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient_emails: [decoded] }),
    });
    if (!sgRes.ok) {
      const body = await sgRes.text();
      console.error('SendGrid suppression error:', sgRes.status, body);
    }
  } catch (err) {
    console.error('Unsubscribe error:', err.message);
  }

  return res.redirect(302, '/unsubscribed.html');
};
