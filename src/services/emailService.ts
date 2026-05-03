export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  async sendEmail(options: EmailOptions) {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }
      return data;
    } catch (error) {
      console.error('Email Service Error:', error);
      // We don't want to break the whole flow if email fails
      return { success: false, error };
    }
  },

  async sendOrderConfirmation(order: any, userEmail: string) {
    const itemsHtml = order.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name} x ${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${(item.product.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #111; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Confirmation</h2>
        <p>Thank you for your order, <strong>${userEmail}</strong>!</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Item</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Total</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">Rs. ${order.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">We will notify you when your order status changes.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="text-align: center; color: #999; font-size: 12px;">© 2026 Fostorio Store. All rights reserved.</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Order Confirmed - ${order.id}`,
      html
    });
  },

  async sendStatusUpdate(order: any, userEmail: string, status: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #111; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Status Updated</h2>
        <p>Hello,</p>
        <p>The status of your order <strong>${order.id}</strong> has been updated to:</p>
        <div style="background-color: #f3f4f6; color: #111; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0;">
          ${status}
        </div>
        <p>You can track your order status in real-time on our website in your profile section.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="text-align: center; color: #999; font-size: 12px;">© 2026 Fostorio Store. All rights reserved.</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Order Status Update - ${order.id}`,
      html
    });
  }
};
