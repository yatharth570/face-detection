const video=document.getElementById('video')


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
])

navigator.mediaDevices.getUserMedia({video:true,audio:false})
  .then(stream => video.srcObject = stream)
  .catch(e => console.error(e));

video.addEventListener("play",()=>{
    const canvas=faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize={width:video.width,height:video.height}
    faceapi.matchDimensions(canvas,displaySize)
    setInterval(async()=>{
        const detections =await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections=faceapi.resizeResults(detections,displaySize)
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    },100)
})