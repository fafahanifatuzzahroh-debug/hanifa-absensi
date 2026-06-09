const video = document.getElementById("video");
const canvas = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");

const statusBox = document.getElementById("status");
const faceCount = document.getElementById("faceCount");

async function loadModels() {

    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');

    console.log("Model berhasil dimuat");
}

async function startCamera() {

    try {

        const stream =
        await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:false
        });

        video.srcObject = stream;

    } catch(error){

        alert("Tidak dapat mengakses kamera");
        console.error(error);

    }
}

async function detectFaces() {

    const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight
    };

    faceapi.matchDimensions(
        canvas,
        displaySize
    );

    setInterval(async ()=>{

        const detections =
        await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions()
        );

        const resized =
        faceapi.resizeResults(
            detections,
            displaySize
        );

        const ctx = canvas.getContext("2d");

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        faceapi.draw.drawDetections(
            canvas,
            resized
        );

        faceCount.textContent =
        detections.length;

        if(detections.length > 0){

            statusBox.innerText =
            "✅ Wajah Berhasil Terdeteksi";

            statusBox.className =
            "status detected";

        } else {

            statusBox.innerText =
            "❌ Tidak Ada Wajah";

            statusBox.className =
            "status not-found";
        }

    },100);

}

startBtn.addEventListener(
    "click",
    async ()=>{

        startBtn.disabled = true;
        startBtn.innerText = "Memuat Model...";

        await loadModels();

        startBtn.innerText = "Mengaktifkan Kamera...";

        await startCamera();

        video.addEventListener(
            "play",
            ()=>{
                detectFaces();
            }
        );

        startBtn.style.display =
        "none";
    }
);