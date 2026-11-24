/**
 * Generates an elegant, Scandinavian-styled HTML invoice email for Copenhagen
 * @param {Object} data - { order, user }
 * @returns {string} HTML string
 */
export const generateOrderReceiptHtml = ({ order, user }) => {
  const customerName = user?.name || user?.firstName || "Valued Collector";
  const frontendUrl =
    process.env.FRONTEND_URL || "https://full-flow-e-commerce-full-stack.vercel.app";

  const itemsRows = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e8e6df;">
        <td style="padding: 16px 8px; vertical-align: top;">
          ${
            item.image
              ? `<img src="${item.image}" alt="${item.name}" width="60" height="60" style="object-fit: cover; border-radius: 2px; border: 1px solid #e0ded8; display: block;" />`
              : ""
          }
        </td>
        <td style="padding: 16px 12px; vertical-align: top;">
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; color: #1e1e1d; letter-spacing: 0.02em;">
            ${item.name}
          </div>
          <div style="font-size: 11px; color: #727068; margin-top: 4px;">
            Variant: ${item.selectedColor || "Standard"} &bull; Qty: ${item.quantity}
          </div>
        </td>
        <td style="padding: 16px 8px; vertical-align: top; text-align: right; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 500; color: #1e1e1d;">
          $${(item.price * item.quantity).toFixed(2)} CAD
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation #${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f6f2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #282827;">

  <!-- Outer Container -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f7f6f2; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Receipt Card -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e4e2da; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          
          <!-- Header Branding -->
          <tr>
            <td align="center" style="background-color: #1a1a19; padding: 32px 20px;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: 300; letter-spacing: 0.25em; color: #ffffff; text-transform: uppercase;">
                COPENHAGEN
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 10px; letter-spacing: 0.18em; color: #a4a29a; text-transform: uppercase;">
                Atelier & Design Archive
              </p>
            </td>
          </tr>

          <!-- Thank You Message -->
          <tr>
            <td style="padding: 35px 30px 20px 30px;">
              <div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #4e5f41; font-weight: 700; margin-bottom: 8px;">
                &bull; Order Confirmed &bull;
              </div>
              <h2 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #1e1e1d;">
                Tak for din ordre, ${customerName}.
              </h2>
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #626058;">
                Your bespoke design pieces have been reserved in our workshop. Below is your detailed receipt and fulfillment confirmation.
              </p>

              <!-- Order Reference Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 24px; background-color: #f9f8f5; border: 1px solid #eceae2; border-radius: 3px; padding: 14px 18px;">
                <tr>
                  <td>
                    <span style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #828078;">Order Reference:</span>
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #1e1e1d; letter-spacing: 0.05em; margin-top: 2px;">
                      ${order.orderNumber}
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #828078;">Payment:</span>
                    <div style="font-size: 12px; font-weight: 600; color: #4e5f41; text-transform: uppercase; margin-top: 2px;">
                      ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit Card (Paid)"}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 10px 30px 20px 30px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <thead>
                  <tr style="border-bottom: 2px solid #1a1a19;">
                    <th align="left" colspan="2" style="padding-bottom: 10px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #1a1a19;">Piece Details</th>
                    <th align="right" style="padding-bottom: 10px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #1a1a19;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Financial Breakdown -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <table width="100%" border="0" cellpadding="4" cellspacing="0" style="font-size: 12px; color: #626058;">
                <tr>
                  <td align="right" style="padding: 4px 0;">Subtotal</td>
                  <td align="right" width="90" style="padding: 4px 0; color: #1e1e1d; font-weight: 500;">$${order.subtotal.toFixed(2)} CAD</td>
                </tr>
                ${
                  order.discount > 0
                    ? `
                <tr>
                  <td align="right" style="padding: 4px 0; color: #4e5f41;">Promotional Atelier Discount</td>
                  <td align="right" style="padding: 4px 0; color: #4e5f41; font-weight: 500;">-$${order.discount.toFixed(2)} CAD</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td align="right" style="padding: 4px 0;">Carbon-Neutral Delivery</td>
                  <td align="right" style="padding: 4px 0; color: #1e1e1d; font-weight: 500;">
                    ${order.shippingFee === 0 ? "Complimentary" : `$${order.shippingFee.toFixed(2)} CAD`}
                  </td>
                </tr>
                <tr>
                  <td align="right" style="padding: 4px 0;">Harmonized Sales Tax (HST 13%)</td>
                  <td align="right" style="padding: 4px 0; color: #1e1e1d; font-weight: 500;">$${order.tax.toFixed(2)} CAD</td>
                </tr>
                <tr style="border-top: 1px solid #1a1a19;">
                  <td align="right" style="padding-top: 10px; font-size: 14px; font-weight: 700; color: #1a1a19; text-transform: uppercase; letter-spacing: 0.05em;">Total Amount</td>
                  <td align="right" style="padding-top: 10px; font-size: 15px; font-weight: 700; color: #1a1a19;">$${order.total.toFixed(2)} CAD</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Destination -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f9f8f5; border: 1px solid #eceae2; border-radius: 3px; padding: 16px;">
                <tr>
                  <td style="vertical-align: top;">
                    <div style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #828078; margin-bottom: 6px;">
                      Dispatch Destination:
                    </div>
                    <div style="font-size: 12px; line-height: 1.5; color: #282827;">
                      <strong>${order.shippingAddress.firstName || ""} ${order.shippingAddress.lastName || ""}</strong><br />
                      ${order.shippingAddress.address}<br />
                      ${order.shippingAddress.city}, ${order.shippingAddress.state || ""} ${order.shippingAddress.postalCode || ""}<br />
                      ${order.shippingAddress.country || "Canada"}
                    </div>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <div style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #828078; margin-bottom: 6px;">
                      Estimated Arrival:
                    </div>
                    <div style="font-size: 12px; font-weight: 600; color: #4e5f41;">
                      ${order.shippingOption?.estimate || "3-5 business days"}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td align="center" style="padding: 0 30px 35px 30px;">
              <a href="${frontendUrl}/account" style="display: inline-block; background-color: #1a1a19; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; padding: 14px 28px; border-radius: 2px;">
                View Order in Member Account &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f3f1ea; padding: 20px; font-size: 11px; color: #86847c; border-top: 1px solid #e6e4dc;">
              <p style="margin: 0 0 6px 0;">
                Questions regarding your shipment? Reply directly to this invoice.
              </p>
              <p style="margin: 0; font-size: 10px; color: #a4a29a;">
                &copy; ${new Date().getFullYear()} COPENHAGEN Design Studio &bull; All rights reserved.
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
};
