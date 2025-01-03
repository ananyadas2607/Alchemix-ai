import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    // Generate HTML structure
    const htmlResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert web developer. Generate clean, modern, and responsive HTML code based on the user's description. Include semantic HTML5 elements and proper structure. Only return the HTML code without any explanation."
        },
        {
          role: "user",
          content: `Create a website template with the following description: ${description}. Return only the HTML code.`
        }
      ],
      temperature: 0.7,
    });

    // Generate matching CSS
    const cssResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert CSS developer. Generate modern, responsive CSS code that matches the provided HTML. Use flexbox/grid, include animations, and ensure mobile responsiveness. Only return the CSS code without any explanation."
        },
        {
          role: "user",
          content: `Create matching CSS for this HTML: ${htmlResponse.choices[0].message.content}. Return only the CSS code.`
        }
      ],
      temperature: 0.7,
    });

    const html = htmlResponse.choices[0].message.content;
    const css = cssResponse.choices[0].message.content;

    // Create a preview by combining HTML and CSS
    const preview = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>
    `;

    return NextResponse.json({
      html,
      css,
      preview
    });

  } catch (error) {
    console.error('Template generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}