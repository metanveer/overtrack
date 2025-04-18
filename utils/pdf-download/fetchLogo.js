export const fetchLogoBase64 = async () => {
  const res = await fetch("/logo_base64.txt");
  const text = await res.text();
  return text;
};
