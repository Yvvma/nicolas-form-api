import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const { name, email, marketingConsent } = await req.json();

    const html = `
      <div style="
        background-color:#0c0c0c;
        padding:32px 24px;
        color:#f5f5f5;
        font-family: Helvetica, Arial, sans-serif;
        border-radius:24px;
        max-width:480px;
        margin:0 auto;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-sizing: border-box;
      ">
        <div style="text-align:center; margin-bottom:32px;">
          <img src="https://res.cloudinary.com/dmgypxge0/image/upload/v1749653403/favicon-nicolas-cabaneco_vtzwqa.png" alt="Logo" width="120" style="max-width:100%; height:auto;" />
        </div>
        <h2 style="
          margin:0 0 16px;
          font-weight: 500;
          font-size: 22px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        ">
           Novo contato recebido
        </h2>
        <div style="
          background-color: transparent;
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-size: 14px;
          line-height: 1.5;
        ">
          <p style="margin: 0 0 12px;"><strong>Nome:</strong> ${name}</p>
          <p style="margin: 0 0 12px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0 0 12px;"><strong>Consent:</strong> ${
            marketingConsent ? 'Sim' : 'Não'
          }</p>
        </div>
        <p style="
          margin-top: 28px;
          font-size: 12px;
          color: #bbb;
          text-align: center;
          letter-spacing: 0.03em;
        ">
          Enviado automaticamente via formulário do site.
        </p>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Formulário Nicolas Cabaneco <contato@nicolascabaneco.com>',
      to: 'contato@nicolascabaneco.com',
      subject: 'Novo contato via Site',
      html,
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
