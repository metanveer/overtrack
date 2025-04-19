export default function round1(val) {
  return Math.round((parseFloat(val) + Number.EPSILON) * 10) / 10;
}
