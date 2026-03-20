"""
Swiss Circle — Blog Article Notification Sender
================================================
Usage:
  py scripts/send-blog-notification.py

You will be prompted for article details, then the email is sent
to all Blog Subscribers via SendGrid.
"""

import urllib.request
import urllib.error
import json
import os
import sys

# ── Config ────────────────────────────────────────────────────────────────────
SENDGRID_API_KEY   = os.environ.get("SENDGRID_API_KEY")
BLOG_LIST_ID       = os.environ.get("SENDGRID_BLOG_LIST_ID", "")   # set in env or paste below
UNSUBSCRIBE_GRP_ID = 28048
FROM_EMAIL         = "noreply@swisscircle.trade"
FROM_NAME          = "Swiss Circle"
BASE_URL           = "https://www.swisscircle.trade/blog"

# ── Article registry ──────────────────────────────────────────────────────────
# Add new articles here each time you publish one.
ARTICLES = {
    "rr": {
        "slug":    "risk-reward-ratio-crypto-trading",
        "title":   "What Is Risk-Reward Ratio in Crypto Trading?",
        "tags":    "Fundamentals · Risk Management",
        "excerpt": "Learn how to calculate risk-reward ratio, use R-multiples like a professional, and why you don't need to win more than 50% of your trades to be consistently profitable.",
    },
    "leverage": {
        "slug":    "leverage-crypto-trading",
        "title":   "What Is Leverage in Crypto Trading — and When Should You Use It?",
        "tags":    "Fundamentals · Risk Management",
        "excerpt": "Leverage amplifies both gains and losses. Learn how it works, how liquidation happens, and the framework professional traders use to decide when leverage is appropriate — and when it isn't.",
    },
    "fed": {
        "slug":    "fed-interest-rates-crypto-trading",
        "title":   "How Fed Interest Rate Decisions Move Crypto Markets",
        "tags":    "Macroeconomics · Market Analysis",
        "excerpt": "When the Federal Reserve raises or cuts rates, crypto markets respond — sometimes dramatically. Learn the transmission mechanism and how to position around FOMC decisions.",
    },
    "ai-signals": {
        "slug":    "ai-agents-vs-crypto-signals",
        "title":   "AI Agents vs Traditional Crypto Signals: What's the Difference?",
        "tags":    "Education · AI & Crypto",
        "excerpt": "AI trading agents and human signal providers both promise edge — but they operate completely differently. Here's an honest comparison of how each works.",
    },
    "ai-risks": {
        "slug":    "risks-ai-trading-agents-crypto",
        "title":   "The Risks of Using AI Trading Agents in Crypto — What You Need to Know",
        "tags":    "Risk Management · AI & Crypto",
        "excerpt": "AI trading agents are gaining traction in crypto. But before you automate your capital, understand the six key risks that most promoters won't tell you about.",
    },
    "tao": {
        "slug":    "bittensor-tao-decentralized-ai-crypto",
        "title":   "Bittensor & the Decentralized AI Narrative: Is $TAO the Bitcoin of Artificial Intelligence?",
        "tags":    "AI & Crypto · Fundamentals",
        "excerpt": "Jensen Huang's GTC 2026 keynote sent AI-linked tokens surging. Here's the fundamentals case for Bittensor — decentralised AI explained, why it compares to BTC, and how to think about it as a trader.",
    },
}

# ── Email HTML builder ────────────────────────────────────────────────────────
def build_html(article):
    url = f"{BASE_URL}/{article['slug']}"
    return f"""<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<title>New Article — Swiss Circle Blog</title>
<style>
  :root {{ color-scheme: dark; }}
  body {{ margin:0!important; padding:0!important; background-color:#07090D!important; }}
</style>
</head>
<body bgcolor="#07090D" style="margin:0;padding:0;background-color:#07090D;-webkit-text-size-adjust:100%;mso-line-height-rule:exactly;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#07090D" style="background-color:#07090D;border-collapse:collapse;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;border-collapse:collapse;">

      <!-- TOP GOLD LINE -->
      <tr><td bgcolor="#C9A84C" height="3" style="height:3px;font-size:1px;line-height:1px;background-color:#C9A84C;">&nbsp;</td></tr>

      <!-- HEADER -->
      <tr>
        <td bgcolor="#0B0E14" align="center" style="background-color:#0B0E14;padding:44px 40px 36px;border-left:1px solid #1E1A10;border-right:1px solid #1E1A10;">
          <img src="https://www.swisscircle.trade/logo.png" width="64" height="64" alt="Swiss Circle" style="display:block;margin:0 auto 20px;width:64px;height:64px;object-fit:contain;">
          <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.45em;color:#C9A84C;text-transform:uppercase;">Swiss Circle</p>
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
            <tr><td bgcolor="#C9A84C" width="50" height="1" style="height:1px;font-size:1px;line-height:1px;">&nbsp;</td></tr>
          </table>
          <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:800;letter-spacing:0.06em;color:#F0E8D0;text-transform:uppercase;line-height:1.2;">NEW ARTICLE</h1>
          <p style="margin:14px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:13px;font-style:italic;color:#8A7A55;letter-spacing:0.04em;">The Swiss Circle Blog</p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td bgcolor="#0D1018" style="background-color:#0D1018;padding:36px 40px;border-left:1px solid #1E1A10;border-right:1px solid #1E1A10;">
          <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;color:#C8B98A;">
            A new article just went live on the Swiss Circle blog.
          </p>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
            <tr><td bgcolor="#1E1A10" height="1" style="height:1px;font-size:1px;line-height:1px;">&nbsp;</td></tr>
          </table>
          <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.35em;color:#C9A84C;text-transform:uppercase;">Latest Article</p>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #1E1A10;border-radius:3px;margin-bottom:28px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.25em;color:#C9A84C;text-transform:uppercase;">{article['tags']}</p>
                <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:700;color:#F0E8D0;line-height:1.3;">{article['title']}</p>
                <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:#6A5C40;">{article['excerpt']}</p>
                <a href="{url}" style="display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#0c0c0c;text-decoration:none;background-color:#C9A84C;padding:10px 22px;border-radius:3px;">Read Article &rarr;</a>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:24px;">
            <tr><td bgcolor="#1E1A10" height="1" style="height:1px;font-size:1px;line-height:1px;">&nbsp;</td></tr>
          </table>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:#4A4030;">
            Want to trade alongside our team in real time?&nbsp;
            <a href="https://whop.com/c/swiss-trader-s-circle/wb" style="color:#C9A84C;text-decoration:none;font-weight:700;">Join Swiss Circle &rarr;</a>
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td bgcolor="#09090D" align="center" style="background-color:#09090D;padding:20px 40px;border:1px solid #1E1A10;border-top:none;border-radius:0 0 4px 4px;">
          <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.18em;color:#8A7040;text-transform:uppercase;">&copy; 2026 Swiss Circle &nbsp;&middot;&nbsp; swisscircle.trade</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#8A7040;">
            You received this because you subscribed to the Swiss Circle Blog.&nbsp;
            <a href="https://www.swisscircle.trade/privacy.html" style="color:#C9A84C;text-decoration:none;">Privacy Policy</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.swisscircle.trade/api/unsubscribe?email={{{{email}}}}" style="color:#C9A84C;text-decoration:none;">Unsubscribe</a>
          </p>
        </td>
      </tr>

      <!-- BOTTOM GOLD LINE -->
      <tr><td bgcolor="#C9A84C" height="2" style="height:2px;font-size:1px;line-height:1px;background-color:#C9A84C;">&nbsp;</td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>"""


def sg_request(method, path, payload=None):
    url  = f"https://api.sendgrid.com/v3/{path}"
    data = json.dumps(payload).encode() if payload else None
    req  = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {SENDGRID_API_KEY}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as r:
            body = r.read()
            return r.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())


def get_list_id():
    """Fetch Blog Subscribers list ID from SendGrid if not set in env."""
    if BLOG_LIST_ID:
        return BLOG_LIST_ID
    status, data = sg_request("GET", "marketing/lists?page_size=50")
    if status != 200:
        print(f"  ✗ Could not fetch lists: {data}")
        return None
    for lst in data.get("result", []):
        if "blog" in lst["name"].lower():
            return lst["id"]
    print("  ✗ Could not find Blog Subscribers list. Set SENDGRID_BLOG_LIST_ID env var.")
    return None


def main():
    if not SENDGRID_API_KEY:
        print("✗ SENDGRID_API_KEY environment variable not set.")
        print("  Run: set SENDGRID_API_KEY=SG.xxx  (Windows) or export SENDGRID_API_KEY=SG.xxx (Mac/Linux)")
        sys.exit(1)

    print("\n-- Swiss Circle Blog Notification Sender --\n")

    # Pick article
    print("Available articles:")
    for key, art in ARTICLES.items():
        print(f"  {key:12} → {art['title'][:60]}")
    print()
    key = input("Enter article key: ").strip().lower()
    if key not in ARTICLES:
        print(f"✗ Unknown key '{key}'. Add it to ARTICLES in this script.")
        sys.exit(1)

    article = ARTICLES[key]
    url     = f"{BASE_URL}/{article['slug']}"
    subject = f"New article: {article['title']}"

    print(f"\n  Article : {article['title']}")
    print(f"  URL     : {url}")
    print(f"  Subject : {subject}")

    # Get list ID
    print("\n  Fetching Blog Subscribers list...")
    list_id = get_list_id()
    if not list_id:
        sys.exit(1)
    print(f"  List ID : {list_id}")

    # Confirm
    confirm = input("\nSend notification email to all Blog Subscribers? (y/n): ").strip().lower()
    if confirm != "y":
        print("Cancelled.")
        sys.exit(0)

    # Build Single Send
    print("\n  Building Single Send...")
    html = build_html(article)

    payload = {
        "name": f"Blog Notification — {article['slug']}",
        "send_to": {"list_ids": [list_id]},
        "email_config": {
            "subject":            subject,
            "html_content":       html,
            "generate_plain_content": True,
            "sender_id":          8651492,
            "suppression_group_id": UNSUBSCRIBE_GRP_ID,
        },
    }

    status, data = sg_request("POST", "marketing/singlesends", payload)
    if status not in (200, 201):
        print(f"  ✗ Failed to create Single Send: {data}")
        sys.exit(1)

    send_id = data["id"]
    print(f"  ✓ Single Send created: {send_id}")

    # Schedule immediately
    status, data = sg_request("PUT", f"marketing/singlesends/{send_id}/schedule", {"send_at": "now"})
    if status not in (200, 201):
        print(f"  ✗ Failed to schedule: {data}")
        sys.exit(1)

    print(f"\n✓ Email sent to all Blog Subscribers.")
    print(f"  Check SendGrid Activity Feed to confirm delivery.\n")


if __name__ == "__main__":
    main()
