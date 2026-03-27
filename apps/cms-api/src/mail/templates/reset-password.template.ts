export const resetPasswordTemplate = (name: string, code: string) => `
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
          <table width="500" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; margin-top:40px; padding:30px; border-radius:8px;">
            
            <tr>
              <td align="center">
                <h2 style="color:#333;">CMS - EdTech</h2>
                <p style="color:#777;">Password Reset</p>
              </td>
            </tr>

            <tr>
              <td>
                <p>Hello, ${name}</p>
                <p>We received a request to reset your password. Use the verification code below:</p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:20px 0;">
                <div style="font-size:32px; font-weight:bold; letter-spacing:8px;">
                  ${code}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <p>This code is valid for <strong>1 hour</strong>.</p>
                <p style="font-size:14px; color:#999;">
                  If you did not request this, you can safely ignore this email.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
`;