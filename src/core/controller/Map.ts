import { Direction } from "../physics";
import { isRotatable, isZoomable } from "../common";
import { itemMap } from "../constants";
import { MapItemNames } from "../enums";
import { BaffleAlphaMapItem, BaffleBetaMapItem } from "../mapitems/baffle";
import { Ball } from "../mapitems/ball";
import { BorderMapItem } from "../mapitems/border-map-item";
import { MapItem } from "../mapitems/map-item";
import { Vector2D, Angle } from "../physics";
import { Physical } from "../physics/kinematics";

export abstract class MapItemJSON {
    abstract name: MapItemNames;
    abstract position: Vector2D;
    abstract zoom?: number;
    abstract rotation?: Direction;
    public static createFromJSON(obj: any): MapItemJSON | null {
        if (
            obj.name &&
            obj.position &&
            obj.position.x !== undefined &&
            obj.position.y !== undefined
        ) {
            return {
                name: obj.name,
                position: new Vector2D(obj.position.x, obj.position.y),
                zoom: obj.zoom,
                rotation: obj.rotation
            };
        } else {
            return null;
        }
    }
}