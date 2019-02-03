import {MathUtil} from './math-util';

export class GpsUtil {

  public static distanceInNmBetweenEarthCoordinates(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadiusKm: number = 6371;

    const dLat: number = MathUtil.radians(lat2 - lat1);
    const dLon: number = MathUtil.radians(lon2 - lon1);

    lat1 = MathUtil.radians(lat1);
    lat2 = MathUtil.radians(lat2);

    const a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c * 0.539957;
  }

  public static getBearing(startLat: number, startLong: number, endLat: number, endLong: number): number {
    startLat = MathUtil.radians(startLat);
    startLong = MathUtil.radians(startLong);
    endLat = MathUtil.radians(endLat);
    endLong = MathUtil.radians(endLong);

    let dLong: number = endLong - startLong;

    const dPhi: number = Math.log(Math.tan(endLat / 2 + Math.PI / 4) / Math.tan(startLat / 2 + Math.PI / 4));
    if (Math.abs(dLong) > Math.PI) {
      if (dLong > 0.0) {
        dLong = -(2.0 * Math.PI - dLong);
      } else {
        dLong = (2.0 * Math.PI + dLong);
      }
    }

    return (MathUtil.degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  }
}
