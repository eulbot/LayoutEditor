module mapp.le {
    export const DefaultFrameOptions: fabric.IRectOptions = <fabric.IRectOptions>{
        left: 200,
        top: 200,
        originX: 'left',
        originY: 'top',
        width: 150,
        height: 100,
        fill: 'rgba(255,0,0,0.5)',
        transparentCorners: true,
        lockRotation: true,
		hasRotatingPoint: false,
		perPixelTargetFind: true,
		minScaleLimit: 1
    };
}