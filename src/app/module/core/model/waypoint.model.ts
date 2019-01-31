import {JsonProperty} from 'ts-serializer-core';

export class Waypoint {

  @JsonProperty('id')
  public id: string = void 0;

  @JsonProperty('name')
  public name: string = void 0;

  @JsonProperty('description')
  public description: string = void 0;

  @JsonProperty('lat')
  public lat: number = void 0;

  @JsonProperty('lng')
  public lng: number = void 0;
}
