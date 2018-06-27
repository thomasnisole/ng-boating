import { Pipe, PipeTransform } from '@angular/core';
import {Waypoint} from '../../core/model/waypoint.model';

@Pipe({
  name: 'waypointsFilter'
})
export class WaypointsFilterPipe implements PipeTransform {

  public transform(waypoints: Waypoint[], filter: string): Waypoint[] {
    if (!waypoints || !filter) {
      return waypoints;
    }

    return waypoints.filter(item => item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }
}
