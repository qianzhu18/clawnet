import QRCode from "qrcode";

type PairingQrProps = {
  value: string;
  size?: number;
  label?: string;
};

export async function PairingQr({ value, size = 180, label = "Pairing QR" }: PairingQrProps) {
  const svg = await QRCode.toString(value, {
    type: "svg",
    width: size,
    margin: 1,
    color: {
      dark: "#1f1d1a",
      light: "#ffffff",
    },
  });
  const markup = svg.replace(/<\?xml[^>]*\?>\s*/g, "");

  return (
    <div
      role="img"
      aria-label={label}
      data-qr-value={value}
      className="overflow-hidden rounded-[1.5rem] bg-white p-4 shadow-[0_18px_40px_rgba(32,24,16,0.08)] [&_svg]:block [&_svg]:size-full"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
