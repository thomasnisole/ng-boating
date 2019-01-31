import {JsonProperty} from 'ts-serializer-core';

export class UserPreferences {

  @JsonProperty('language')
  public language: string;

  @JsonProperty('port')
  public port: string;

  @JsonProperty('baudRate')
  public baudRate: number;

  @JsonProperty('waypointsFileName')
  public waypointsFileName: string;
}
