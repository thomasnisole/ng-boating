export class Port {

  public name: string;

  public manufacturer: string;

  public pnpId: string;

  public constructor(name: string, manufacturer: string, pnpId: string) {
    this.name = name;
    this.manufacturer = manufacturer;
    this.pnpId = pnpId;
  }
}
