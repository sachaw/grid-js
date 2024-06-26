import { GeometryType, Point as MilPoint } from "@dewars/simple-features";
import { GridUtils } from "../GridUtils.ts";
import type { GridTile } from "../tile/GridTile.ts";
import type { Pixel } from "../tile/Pixel.ts";
import type { Bounds } from "./Bounds.ts";
import { Unit } from "./Unit.ts";

/**
 * Point
 */
export class Point extends MilPoint {
  /**
   * Unit
   */
  private unit?: Unit = Unit.Degree;

  public static create(
    hasZ?: boolean,
    hasM?: boolean,
  ): Point {
    return new Point(GeometryType.Point, hasZ, hasM);
  }

  /**
   * Create a point
   *
   * @param longitude longitude
   * @param latitude latitude
   * @param unit unit; if null, it will use the default degree unit
   * @return point
   */
  public static point(longitude: number, latitude: number, unit?: Unit): Point {
    let point: Point;
    if (unit !== undefined) {
      point = Point.create();
      point.setLatitude(latitude);
      point.setLongitude(longitude);
      point.unit = unit;
    } else {
      point = Point.degrees(longitude, latitude);
    }
    return point;
  }

  /**
   * Create a point in degrees
   *
   * @param longitude longitude in degrees
   * @param latitude latitude in degrees
   * @return point in degrees
   */
  public static degrees(longitude: number, latitude: number): Point {
    return Point.point(longitude, latitude, Unit.Degree);
  }

  /**
   * Create a point in meters
   *
   * @param longitude longitude in meters
   * @param latitude latitude in meters
   * @return point in meters
   */
  public static meters(longitude: number, latitude: number): Point {
    return Point.point(longitude, latitude, Unit.Meter);
  }

  /**
   * Create a point from a coordinate in a unit to another unit
   *
   * @param fromUnit unit of provided coordinate
   * @param longitude longitude
   * @param latitude latitude
   * @param toUnit desired unit
   * @return point in unit
   */
  public static toUnit(
    fromUnit: Unit,
    longitude: number,
    latitude: number,
    toUnit: Unit,
  ): Point {
    return GridUtils.toUnit(fromUnit, longitude, latitude, toUnit);
  }

  /**
   * Create a point from a coordinate in an opposite unit to another unit
   *
   * @param longitude longitude
   * @param latitude latitude
   * @param unit desired unit
   * @return point in unit
   */
  public static toUnitInverse(
    longitude: number,
    latitude: number,
    unit: Unit,
  ): Point {
    return GridUtils.toUnitOpposite(longitude, latitude, unit);
  }

  /**
   * Create a point converting the degrees coordinate to meters
   *
   * @param longitude longitude in degrees
   * @param latitude latitude in degrees
   * @return point in meters
   */
  public static degreesToMeters(longitude: number, latitude: number): Point {
    return Point.toUnit(Unit.Degree, longitude, latitude, Unit.Meter);
  }

  /**
   * Create a point converting the meters coordinate to degrees
   *
   * @param longitude longitude in meters
   * @param latitude latitude in meters
   * @return point in degrees
   */
  public static metersToDegrees(longitude: number, latitude: number): Point {
    return Point.toUnit(Unit.Meter, longitude, latitude, Unit.Degree);
  }

  /**
   * Create a point
   *
   * @param point point to copy
   * @param unit unit
   * @return point
   */
  public static pointFromPoint(point: MilPoint, unit?: Unit): Point {
    const newPoint = Point.create();
    newPoint.x = point.x;
    newPoint.y = point.y;
    newPoint.z = point.z;
    newPoint.m = point.m;
    newPoint.unit = unit;
    return newPoint;
  }

  /**
   * Get the longitude
   *
   * @return longitude
   */
  public getLongitude(): number {
    return this.x;
  }

  /**
   * Set the longitude
   *
   * @param longitude longitude
   */
  public setLongitude(longitude: number): void {
    this.x = longitude;
  }

  /**
   * Get the latitude
   *
   * @return latitude
   */
  public getLatitude(): number {
    return this.y;
  }

  /**
   * Set the latitude
   *
   * @param latitude latitude
   */
  public setLatitude(latitude: number): void {
    this.y = latitude;
  }

  /**
   * Get the unit
   *
   * @return unit
   */
  public getUnit(): Unit | undefined {
    return this.unit;
  }

  /**
   * Set the unit
   *
   * @param unit unit
   */
  public setUnit(unit?: Unit): void {
    this.unit = unit;
  }

  /**
   * Is in the provided unit type
   *
   * @param unit unit
   * @return true if in the unit
   */
  public isUnit(unit?: Unit): boolean {
    return this.unit === unit;
  }

  /**
   * Is this point in degrees
   *
   * @return true if degrees
   */
  public isDegrees(): boolean {
    return this.isUnit(Unit.Degree);
  }

  /**
   * Is this point in meters
   *
   * @return true if meters
   */
  public isMeters(): boolean {
    return this.isUnit(Unit.Meter);
  }

  /**
   * Convert to the unit
   *
   * @param unit unit
   * @return point in units, same point if equal units
   */
  public toUnit(unit: Unit): Point {
    let newPoint: Point;
    if (this.isUnit(unit)) {
      newPoint = this;
    } else {
      if (this.unit === undefined) {
        throw new Error("Unit is not set");
      }
      newPoint = GridUtils.toUnit(
        this.unit,
        this.getLongitude(),
        this.getLatitude(),
        unit,
      );
    }
    return newPoint;
  }

  /**
   * Convert to degrees
   *
   * @return point in degrees, same point if already in degrees
   */
  public toDegrees(): Point {
    return this.toUnit(Unit.Degree);
  }

  /**
   * Convert to meters
   *
   * @return point in meters, same point if already in meters
   */
  public toMeters(): Point {
    return this.toUnit(Unit.Meter);
  }

  /**
   * Get the pixel where the point fits into tile
   *
   * @param tile tile
   * @return pixel
   */
  public getPixelFromTile(tile: GridTile): Pixel {
    const bounds = tile.getBounds();
    if (!bounds) {
      throw new Error("Bounds is not set");
    }
    return this.getPixel(tile.getWidth(), tile.getHeight(), bounds);
  }

  /**
   * Get the pixel where the point fits into the bounds
   *
   * @param width width
   * @param height height
   * @param bounds bounds
   * @return pixel
   */
  public getPixel(width: number, height: number, bounds: Bounds): Pixel {
    return GridUtils.getPixel(width, height, bounds, this);
  }

  /**
   * {@inheritDoc}
   */
  public equals(other: Point): boolean {
    if (this === other) {
      return true;
    }
    if (!super.equals(other)) {
      return false;
    }
    if (!(other instanceof Point)) {
      return false;
    }

    if (this.unit !== other.getUnit()) {
      return false;
    }
    return true;
  }
}
