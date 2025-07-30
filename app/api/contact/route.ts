import { NextRequest, NextResponse } from 'next/server';
import { ContactFormData } from '@/lib/types';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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
      console.log('Contact form submission saved:', submission.id);
    } catch (error) {
      console.log('File write error:', error);
      // Continue even if file write fails
    }

    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully!',
        submissionId: submission.id,
        note: 'Your message has been received and saved. Email functionality will be configured later.'
      },
      { status: 200 }
    );

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
