// Utility formatters for Asri Collection

export function formatRupiah(amount: number | string | undefined | null): string {
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  if (numeric === undefined || numeric === null || isNaN(numeric)) {
    return "Rp 0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function generateMerchantOrderId(): string {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ASRI-${timestamp}-${randomSuffix}`;
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function calculateDiscount(price: number, discountPercentage: number): number {
  if (!discountPercentage || discountPercentage <= 0) return 0;
  return Math.round((price * discountPercentage) / 100);
}

export function buildWhatsAppOrderMessage({
  orderId,
  customerName,
  customerPhone,
  customerAddress,
  notes,
  items,
  subtotal,
  discount,
  shippingFee,
  total,
  couponCode,
}: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  items: Array<{ title: string; quantity: number; price: number; variant?: string }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
}): string {
  const itemsText = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.title}* ${item.variant ? `(${item.variant})` : ""}\n   ${item.quantity}x @ ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}`
    )
    .join("\n");

  const message = `*HALO CS ASRI COLLECTION, SAYA INGIN MEMESAN:*
----------------------------------------
*No. Pesanan:* ${orderId}
*Nama:* ${customerName}
*No. WhatsApp:* ${customerPhone}
*Alamat Pengiriman:* ${customerAddress}
${notes ? `*Catatan Khusus:* ${notes}\n` : ""}----------------------------------------
*DAFTAR PRODUK:*
${itemsText}
----------------------------------------
*Subtotal:* ${formatRupiah(subtotal)}
${discount > 0 ? `*Diskon Promo (${couponCode || "VOUCHER"}):* -${formatRupiah(discount)}\n` : ""}*Ongkos Kirim:* ${shippingFee === 0 ? "GRATIS (Promo Toko)" : formatRupiah(shippingFee)}
*TOTAL TAGIHAN:* *${formatRupiah(total)}*
----------------------------------------
Mohon dibantu konfirmasi pesanan dan instruksi pembayarannya. Terima kasih!`;

  return encodeURIComponent(message);
}
