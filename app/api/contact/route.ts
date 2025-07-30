
import { NextRequest, NextResponse } from 'next/server';
import { ContactFormData } from '@/lib/types';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

// Email recipients
const EMAIL_RECIPIENTS = [
  'slashingsimulator@gmail.com',
  'greatarchon999@gmail.com',
  'abhibagga29@gmail.com'
];

// Service type labels for better email formatting
const SERVICE_LABELS: { [key: string]: string } = {
  'game-development': 'Full-Cycle Development',
  'game-acquisition': 'Game Acquisition & Buyouts',
  'growth-services': 'Growth & Live Operations',
  'developer-recruitment': 'Developer Recruitment',
  'investment': 'Investment Opportunities',
  'networking': 'Professional Networking',
  'general': 'General Inquiry'
};

// Budget labels for better email formatting
const BUDGET_LABELS: { [key: string]: string } = {
  'under-10k': 'Under $10,000',
  '10k-50k': '$10,000 - $50,000',
  '50k-100k': '$50,000 - $100,000',
  '100k-500k': '$100,000 - $500,000',
  '500k-plus': '$500,000+',
  'discuss': 'Prefer to discuss'
};

// Timeline labels for better email formatting
const TIMELINE_LABELS: { [key: string]: string } = {
  'urgent': 'ASAP (Rush project)',
  '1-month': 'Within 1 month',
  '2-3-months': '2-3 months',
  '3-6-months': '3-6 months',
  '6-months-plus': '6+ months',
  'flexible': 'Flexible timeline'
};

// Experience labels for better email formatting
const EXPERIENCE_LABELS: { [key: string]: string } = {
  'beginner': 'New to Roblox development',
  'some-experience': 'Some experience with Roblox',
  'experienced': 'Experienced Roblox developer',
  'studio-owner': 'Studio owner/Game publisher',
  'investor': 'Investor/Business partner'
};

function formatEmailContent(data: ContactFormData, submissionId: string): string {
  const serviceLabel = SERVICE_LABELS[data.serviceType] || data.serviceType;
  const budgetLabel = data.budget ? BUDGET_LABELS[data.budget] || data.budget : null;
  const timelineLabel = data.timeline ? TIMELINE_LABELS[data.timeline] || data.timeline : null;
  const experienceLabel = data.experience ? EXPERIENCE_LABELS[data.experience] || data.experience : null;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #3b82f6); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: 600; color: #4f46e5; margin-bottom: 5px; display: block; }
        .value { background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #6366f1; }
        .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        .highlight { color: #6366f1; font-weight: 600; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎮 New Contact Form Submission</h1>
        <p>Swansa x PeacefulPlay Studio</p>
    </div>
    
    <div class="content">
        <div class="field">
            <span class="label">📋 Submission ID:</span>
            <div class="value"><code>${submissionId}</code></div>
        </div>

        <div class="grid">
            <div class="field">
                <span class="label">👤 Name:</span>
                <div class="value">${data.name}</div>
            </div>
            <div class="field">
                <span class="label">📧 Email:</span>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
        </div>

        ${data.company ? `
        <div class="field">
            <span class="label">🏢 Company/Studio:</span>
            <div class="value">${data.company}</div>
        </div>
        ` : ''}

        <div class="grid">
            <div class="field">
                <span class="label">🎯 Service Interest:</span>
                <div class="value"><span class="highlight">${serviceLabel}</span></div>
            </div>
            ${experienceLabel ? `
            <div class="field">
                <span class="label">🎮 Roblox Experience:</span>
                <div class="value">${experienceLabel}</div>
            </div>
            ` : ''}
        </div>

        <div class="field">
            <span class="label">📝 Subject:</span>
            <div class="value"><strong>${data.subject}</strong></div>
        </div>

        <div class="field">
            <span class="label">💬 Message:</span>
            <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
        </div>

        ${budgetLabel || timelineLabel ? `
        <div class="grid">
            ${budgetLabel ? `
            <div class="field">
                <span class="label">💰 Budget Range:</span>
                <div class="value">${budgetLabel}</div>
            </div>
            ` : ''}
            ${timelineLabel ? `
            <div class="field">
                <span class="label">⏰ Timeline:</span>
                <div class="value">${timelineLabel}</div>
            </div>
            ` : ''}
        </div>
        ` : ''}
    </div>

    <div class="footer">
        <p>📅 Submitted on: <strong>${new Date().toLocaleString('en-US', { 
          timeZone: 'UTC',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })}</strong></p>
        <p>This inquiry was submitted through the Swansa x PeacefulPlay Studio contact form.</p>
    </div>
</body>
</html>
  `.trim();
}

// Enhanced email sending function with multiple fallback methods
async function sendContactEmailWithFallbacks(data: ContactFormData, submissionId: string): Promise<{ success: boolean; error?: string; method?: string }> {
  const htmlContent = formatEmailContent(data, submissionId);
  const textContent = createTextContent(data, submissionId);
  const emailSubject = `🎮 New Contact Form: ${data.subject} - ${data.name}`;

  // Method 1: Try SendGrid if API key is available
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  if (sendgridApiKey && sendgridApiKey !== 'your-sendgrid-api-key') {
    try {
      sgMail.setApiKey(sendgridApiKey);
      
      const msg = {
        to: EMAIL_RECIPIENTS,
        from: {
          email: 'noreply@swansapeacefulplay.com',
          name: 'Swansa x PeacefulPlay Studio'
        },
        subject: emailSubject,
        text: textContent,
        html: htmlContent,
        replyTo: data.email
      };

      await sgMail.send(msg);
      console.log('✅ Email sent successfully via SendGrid to:', EMAIL_RECIPIENTS);
      return { success: true, method: 'SendGrid' };
    } catch (error: any) {
      console.log('SendGrid failed, trying Gmail SMTP...', error.message);
    }
  }

  // Method 2: Try Gmail SMTP if properly configured
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;
  
  const isGmailConfigured = gmailUser && 
                           gmailPassword && 
                           gmailPassword !== 'your-16-character-app-password' &&
                           gmailPassword !== 'your-app-password-here' &&
                           gmailPassword.length >= 16;

  if (isGmailConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: gmailUser,
          pass: gmailPassword
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      await transporter.verify();
      
      const mailOptions = {
        from: `"Swansa x PeacefulPlay Studio" <${gmailUser}>`,
        to: EMAIL_RECIPIENTS.join(', '),
        subject: emailSubject,
        text: textContent,
        html: htmlContent,
        replyTo: data.email
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully via Gmail SMTP to:', EMAIL_RECIPIENTS);
      return { success: true, method: 'Gmail SMTP' };
    } catch (error: any) {
      console.log('Gmail SMTP failed, using enhanced test mode...', error.message);
    }
  }

  // Method 3: Enhanced test mode that sends to actual recipients via Ethereal
  // This is our fallback that ensures emails are always sent somewhere testable
  try {
    const testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      },
    });

    const mailOptions = {
      from: `"Swansa x PeacefulPlay Studio [TEST]" <test@ethereal.email>`,
      to: 'test@ethereal.email',
      subject: `[TEST MODE] ${emailSubject}`,
      text: `
=== THIS IS A TEST EMAIL ===
In production, this would be sent to: ${EMAIL_RECIPIENTS.join(', ')}

${textContent}

=== SETUP INSTRUCTIONS ===
To send real emails, configure either:
1. Gmail App Password in GMAIL_APP_PASSWORD
2. SendGrid API Key in SENDGRID_API_KEY
      `,
      html: `
<div style="background: #fee2e2; border: 2px solid #dc2626; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
  <h2 style="color: #dc2626; margin: 0 0 10px 0;">⚠️ TEST MODE EMAIL</h2>
  <p style="margin: 0; color: #991b1b;">
    <strong>In production, this would be sent to:</strong><br>
    ${EMAIL_RECIPIENTS.map(email => `• ${email}`).join('<br>')}
  </p>
</div>

${htmlContent}

<div style="background: #f0f9ff; border: 2px solid #0ea5e9; padding: 20px; margin-top: 20px; border-radius: 8px;">
  <h3 style="color: #0c4a6e; margin: 0 0 10px 0;">🔧 Setup Instructions</h3>
  <p style="margin: 0; color: #075985;">
    To send real emails, configure either:<br>
    1. Gmail App Password in <code>GMAIL_APP_PASSWORD</code><br>
    2. SendGrid API Key in <code>SENDGRID_API_KEY</code>
  </p>
</div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(result);
    
    console.log('📧 Test email sent successfully!');
    console.log('🔍 Preview URL:', previewUrl);
    console.log('⚠️  Note: Configure real email service for production');
    
    return { 
      success: true, 
      method: 'Test Mode',
      error: `Email sent in TEST MODE. Preview: ${previewUrl}. Configure Gmail or SendGrid for production.`
    };
  } catch (error: any) {
    console.error('All email methods failed:', error);
    return { 
      success: false, 
      error: `All email services failed. Last error: ${error.message}` 
    };
  }
}

function createTextContent(data: ContactFormData, submissionId: string): string {
  return `
New Contact Form Submission - Swansa x PeacefulPlay Studio

Submission ID: ${submissionId}
Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}` : ''}
Service Interest: ${SERVICE_LABELS[data.serviceType] || data.serviceType}
Subject: ${data.subject}

Message:
${data.message}

${data.budget ? `Budget: ${BUDGET_LABELS[data.budget] || data.budget}` : ''}
${data.timeline ? `Timeline: ${TIMELINE_LABELS[data.timeline] || data.timeline}` : ''}
${data.experience ? `Experience: ${EXPERIENCE_LABELS[data.experience] || data.experience}` : ''}

Submitted: ${new Date().toLocaleString()}
  `.trim();
}



export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.serviceType || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create contact submission object
    const submission = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      email: body.email,
      company: body.company || null,
      serviceType: body.serviceType,
      subject: body.subject,
      message: body.message,
      budget: body.budget || null,
      timeline: body.timeline || null,
      experience: body.experience || null,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    // Save to file (backup method)
    const filePath = join(process.cwd(), 'contact-submissions.json');
    try {
      await writeFile(filePath, JSON.stringify(submission, null, 2) + '\n---\n', { flag: 'a' });
    } catch (error) {
      console.log('File write info:', error);
      // Continue even if file write fails
    }

    // Send email using enhanced multi-method approach
    const emailResult = await sendContactEmailWithFallbacks(body, submission.id);
    
    if (emailResult.success) {
      const method = emailResult.method || 'Unknown';
      
      // Check if we got a test mode response (has preview URL in error field)
      if (emailResult.error && emailResult.error.includes('Preview:')) {
        const previewUrl = emailResult.error.split('Preview: ')[1].split('.')[0] + '.' + emailResult.error.split('Preview: ')[1].split('.')[1];
        return NextResponse.json(
          { 
            message: `Contact form submitted and email sent via ${method}!`,
            submissionId: submission.id,
            testMode: true,
            method: method,
            previewUrl: previewUrl,
            warning: 'Email sent in TEST MODE. Configure Gmail App Password or SendGrid API Key for production emails.'
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { 
            message: `Contact form submitted and email sent successfully via ${method}!`,
            submissionId: submission.id,
            method: method,
            recipients: EMAIL_RECIPIENTS
          },
          { status: 200 }
        );
      }
    } else {
      // Email failed but we still saved the submission
      console.error('All email methods failed:', emailResult.error);
      return NextResponse.json(
        { 
          message: 'Contact form submitted successfully, but email delivery failed',
          submissionId: submission.id,
          error: emailResult.error || 'All email delivery methods failed',
          warning: 'Please configure Gmail App Password or SendGrid API Key'
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Contact API endpoint is working' },
    { status: 200 }
  );
}
