export function formatAddress(address: any): string {
  if (!address) return '';
  const parts = [
    address.address1,
    address.address2,
    address.city,
    address.state,
    address.postal_code,
    address.country_id,
  ].filter(Boolean);
  return parts.join(', ');
}
export default { formatAddress };
