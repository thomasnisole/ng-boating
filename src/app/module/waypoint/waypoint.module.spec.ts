import { WaypointModule } from './waypoint.module';

describe('WaypointModule', () => {
  let waypointModule: WaypointModule;

  beforeEach(() => {
    waypointModule = new WaypointModule();
  });

  it('should create an instance', () => {
    expect(waypointModule).toBeTruthy();
  });
});
