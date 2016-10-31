/// <reference path="../models/util.ts" />

module mapp.le {
    export const DefaultFrameOptions: fabric.IRectOptions = <fabric.IRectOptions>{
        left: 200,
        top: 200,
        originX: 'left',
        originY: 'top',
        width: 150,
        height: 100,
        lockRotation: true,
		hasRotatingPoint: false,
		perPixelTargetFind: true,
        hasBorders: false,
        lockUniScaling: false,
        strokeWidth: 0,
        cornerColor: '#333',
        cornerSize: 6,
        transparentCorners: false
    };
}