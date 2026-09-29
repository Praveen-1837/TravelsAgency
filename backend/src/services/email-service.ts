import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

interface CallbackNotificationData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  packageTitle?: string;
  travelDates?: { from?: string; to?: string };
  groupSize?: number;
  specialRequests?: string;
}

export async function sendCallbackNotifications(data: CallbackNotificationData): Promise<void> {
  if (!apiKey) {
    console.info(
      `[EmailService] SendGrid API key not configured. Mocking notification for callback ${data.id} (${data.name}, +91 ${data.phone}).`
    );
    return;
  }

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'inquiries@aarivavoyages.com';
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'ops@aarivavoyages.com';

  const dateStr =
    data.travelDates?.from && data.travelDates?.to
      ? `${data.travelDates.from} to ${data.travelDates.to}`
      : data.travelDates?.from || 'Flexible / Not specified';

  // 1. Alert to internal Aariva Voyages operations team
  const teamEmailMsg = {
    to: notificationEmail,
    from: fromEmail,
    subject: `🚨 New Callback Request: ${data.name} (+91 ${data.phone}) - Aariva Voyages`,
    html: `
      <div style="font-family: sans-serif; color: #191C1E; line-height: 1.6; max-width: 600px;">
        <h2 style="color: #FF5722; margin-bottom: 4px;">New Callback Request Received</h2>
        <p style="font-size: 13px; color: #565E74; margin-top: 0;">Inquiry Reference ID: ${data.id}</p>
        <hr style="border: 0; border-top: 1px solid #E0E3E5; margin: 16px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px;">Customer Name:</td>
            <td style="padding: 8px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Mobile Number:</td>
            <td style="padding: 8px 0;">
              <a href="tel:+91${data.phone}" style="color: #FF5722; font-weight: bold;">+91 ${data.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">WhatsApp Chat:</td>
            <td style="padding: 8px 0;">
              <a href="https://wa.me/91${data.phone}?text=Hi%20${encodeURIComponent(data.name)},%20reaching%20out%20from%20Aariva%20Voyages%20regarding%20your%20callback%20request." style="background-color: #25D366; color: #ffffff; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: bold;">
                Open WhatsApp
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email Address:</td>
            <td style="padding: 8px 0;">${data.email || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Selected Package:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #191C1E;">${data.packageTitle || 'General Domestic Holiday Inquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Travel Dates:</td>
            <td style="padding: 8px 0;">${dateStr}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Group Size:</td>
            <td style="padding: 8px 0;">${data.groupSize || 2} Travelers</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Special Requests:</td>
            <td style="padding: 8px 0; font-style: italic;">${data.specialRequests || 'None specified'}</td>
          </tr>
        </table>
        <hr style="border: 0; border-top: 1px solid #E0E3E5; margin: 16px 0;" />
        <p style="font-size: 13px; color: #565E74;">Please update the status in the Admin Dashboard once contacted.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(teamEmailMsg);
  } catch (err) {
    console.error('[EmailService] Failed to send team alert email:', err);
  }

  // 2. Confirmation email to customer (if email was provided)
  if (data.email) {
    const customerEmailMsg = {
      to: data.email,
      from: fromEmail,
      subject: 'We have received your callback request — Aariva Voyages',
      html: `
        <div style="font-family: sans-serif; color: #191C1E; line-height: 1.6; max-width: 600px;">
          <h2 style="color: #FF5722; margin-bottom: 4px;">Namaste ${data.name},</h2>
          <p>Thank you for inquiring with <strong>Aariva Voyages</strong>! We have received your callback request for <strong>${
            data.packageTitle || 'your custom domestic holiday'
          }</strong>.</p>
          <p>One of our dedicated destination trip marshals will call or WhatsApp you shortly on <strong>+91 ${
            data.phone
          }</strong> to discuss your personalized itinerary and special rates.</p>
          <div style="background-color: #F2F4F6; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #E0E3E5;">
            <p style="margin: 0 0 8px 0;"><strong>Travel Dates:</strong> ${dateStr}</p>
            <p style="margin: 0 0 8px 0;"><strong>Travelers:</strong> ${data.groupSize || 2} Pax</p>
            <p style="margin: 0;"><strong>Special Requests:</strong> ${data.specialRequests || 'None'}</p>
          </div>
          <p>If you need immediate assistance or wish to speak to us right away, call our 24x7 helpline: <strong>+91 98765 43210</strong>.</p>
          <p style="margin-top: 24px;">Warm regards,<br /><strong>Team Aariva Voyages</strong><br /><span style="font-size: 12px; color: #565E74;">Curated Domestic Experiences across India</span></p>
        </div>
      `,
    };

    try {
      await sgMail.send(customerEmailMsg);
    } catch (err) {
      console.error('[EmailService] Failed to send customer confirmation email:', err);
    }
  }
}
