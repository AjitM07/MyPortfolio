const express = require('express');
const router  = express.Router();
const { Resend } = require('resend');

// POST /api/contact - Send message via Resend (DMARC-safe, no custom domain required)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are all required.' });
    }

    const cleanName    = String(name).trim();
    const cleanEmail   = String(email).trim().toLowerCase();
    const cleanMessage = String(message).trim();

    const resendKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || 'ajitmangsulikar950@gmail.com';

    if (!resendKey) {
      console.warn('[Contact] RESEND_API_KEY is not set in backend/.env');
      return res.status(500).json({
        message: 'Email service is not configured. Add RESEND_API_KEY to backend/.env.'
      });
    }

    const resend = new Resend(resendKey);

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Portfolio Message</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:36px 40px;text-align:center;">
              
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
                &lt; Ajit's Portfolio /&gt;
              </h1>
              <p style="margin:10px 0 0 0;font-size:18px;color:rgba(255,255,255,0.55);letter-spacing:0.05em;">
                Contact Form Notification
              </p>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="background:linear-gradient(90deg,#e8a87c,#d4956a,#c4824d);height:3px;"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">

              <p style="margin:0 0 24px 0;font-size:15px;color:#6b7280;line-height:1.6;">
                You received a new message from your portfolio contact form.
              </p>

              <!-- Sender Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="36" style="vertical-align:top;padding-right:14px;">
                          <div style="width:36px;height:36px;background:linear-gradient(135deg,#1a1a2e,#0f3460);border-radius:50%;display:table-cell;text-align:center;vertical-align:middle;font-size:15px;font-weight:700;color:#ffffff;line-height:36px;">
                            ${cleanName.charAt(0).toUpperCase()}
                          </div>
                        </td>
                        <td style="vertical-align:top;">
                          <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#111827;">${cleanName}</p>
                          <a href="mailto:${cleanEmail}" style="font-size:14px;color:#6b7280;text-decoration:none;">${cleanEmail}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Box -->
              <p style="margin:0 0 10px;font-size:18px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af;">
                Message
              </p>
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-left:3px solid #1a1a2e;border-radius:0 8px 8px 0;padding:20px 22px;margin-bottom:28px;">
                <p style="margin:0;font-size:15px;color:#374151;line-height:1.75;white-space:pre-wrap;">${cleanMessage}</p>
              </div>

              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${cleanEmail}?subject=Re: Your message on Ajit's Portfolio"
                       style="display:inline-block;background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:13px 32px;border-radius:8px;letter-spacing:0.03em;">
                       Reply to ${cleanName}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">
                This email was sent from <strong>Ajit's Portfolio</strong> contact form.
              </p>
              <p style="margin:0;font-size:11px;color:#d1d5db;">
                &copy; ${new Date().getFullYear()} Ajit Mangsulikar · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      // resend.dev is Resend's own fully-authenticated shared sender domain.
      // No custom domain needed. Passes SPF, DKIM and DMARC out of the box.
      from:     `Ajit's Portfolio <onboarding@resend.dev>`,
      to:       [recipient],
      reply_to: cleanEmail,                               // replies go to the visitor
      subject:  `Portfolio message from ${cleanName}`,
      html:     htmlBody,
      text:     `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`
    });

    if (error) {
      console.error('[Contact] Resend error:', error);
      return res.status(500).json({
        message: 'Failed to send message via Resend.',
        error: error.message
      });
    }

    console.log('[Contact] Resend dispatched. Id:', data?.id);
    return res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });

  } catch (err) {
    console.error('[Contact] Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
});

module.exports = router;
