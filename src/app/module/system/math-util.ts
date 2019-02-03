export class MathUtil {

  public static radians(n): number {
    return n * (Math.PI / 180);
  }

  public static degrees(n): number {
    return n * (180 / Math.PI);
  }
}
