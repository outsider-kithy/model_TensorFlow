import * as THREE from 'three';

window.addEventListener("DOMContentLoaded", function(){

    //器官のscoreの閾値
    const threshold = 0.7;

    //検出結果を描画するcanvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    //デバイスのカメラからの映像
    const video = document.getElementById("video");
    const videoWidth = 300;
    const videoHeight = 200;
    const zOffset = -5;

    //Three.jsのシーンを描画するcanvas
    const webGLCanvas = document.getElementById("webgl");

    //Three.js
    let scene, camera, renderer;

    //部位
    let head;
    let leftShoulder, leftElbow, leftWrist;
    let rightShoulder, rightElbow, rightWrist;
    let leftHip, leftKnee, leftAnkle;
    let rightHip, rightKnee, rightAnkle;
   
    //シーンの初期設定
    function threeSetup(webGLCanvas){
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.innerWidth / window.innerHeight);
        renderer.shadowMap.enabled = true;
        webGLCanvas.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight ,1 ,1000);
        camera.position.set(0, 0, zOffset * 5);
        camera.lookAt(0,0,0);
        
        //環境光
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        //平行光源
        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        scene.add(directionalLight);

        //マテリアル
        let bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
        });

        //頭の球
        let headGeometry = new THREE.SphereGeometry(1,32,32);
        head = new THREE.Mesh(headGeometry, bodyMaterial);
        scene.add(head);

        let jointGeometry = new THREE.BoxGeometry(1,1,1);
        //左肩
        leftShoulder = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(leftShoulder);
        
        //左ひじ
        leftElbow = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(leftElbow);

        //左手首
        leftWrist = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(leftWrist);

        //右肩
        rightShoulder = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(rightShoulder);

        //右ひじ
        rightElbow = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(rightElbow);

        //右手首
        rightWrist = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(rightWrist);

        //左おしり
        leftHip = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(leftHip);

        //左ひざ
        leftKnee = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(leftKnee);

        //左足首
        leftAnkle = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(leftAnkle);

        //右おしり
        rightHip = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(rightHip);

        //右ひざ
        rightKnee = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(rightKnee);

        //右足首
        rightAnkle = new THREE.Mesh(jointGeometry, bodyMaterial);
        scene.add(rightAnkle);

        return scene, camera, renderer;
    }

    //アニメーション
    function threeDraw(pose){
        //console.log(pose);
        
        renderer.render(scene, camera);
        pose.keypoints.forEach(function(keypoint){
            //頭
            if(keypoint.part == "nose"){
                let position = calcPosition(keypoint);
                head.position.set(position.x, position.y, 0);
            }
            //左肩
            if(keypoint.part == "leftShoulder"){
                let position = calcPosition(keypoint);
                leftShoulder.position.set(position.x, position.y, 0);
            }
            //左ひじ
            if(keypoint.part == "leftElbow"){
                let position = calcPosition(keypoint);
                leftElbow.position.set(position.x, position.y, 0);
            }
            //左手首
            if(keypoint.part == "leftWrist"){
                let position = calcPosition(keypoint);
                leftWrist.position.set(position.x, position.y, 0);
            }
            //右肩
            if(keypoint.part == "rightShoulder"){
                let position = calcPosition(keypoint);
                rightShoulder.position.set(position.x, position.y, 0);
            }
            //右ひじ
            if(keypoint.part == "rightElbow"){
                let position = calcPosition(keypoint);
                rightElbow.position.set(position.x, position.y, 0);
            }
            //右手首
            if(keypoint.part == "rightWrist"){
                let position = calcPosition(keypoint);
                rightWrist.position.set(position.x, position.y, 0);
            }
            //左おしり
            if(keypoint.part == "leftHip"){
                let position = calcPosition(keypoint);
                leftHip.position.set(position.x, position.y, 0);
            }
            //左ひざ
            if(keypoint.part == "leftKnee"){
                let position = calcPosition(keypoint);
                leftKnee.position.set(position.x, position.y, 0);
            }
            //左足首
            if(keypoint.part == "leftAnkle"){
                let position = calcPosition(keypoint);
                leftAnkle.position.set(position.x, position.y, 0);
            }
            //右おしり
            if(keypoint.part == "rightHip"){
                let position = calcPosition(keypoint);
                rightHip.position.set(position.x, position.y, 0);
            }
            //右ひざ
            if(keypoint.part == "rightKnee"){
                let position = calcPosition(keypoint);
                rightKnee.position.set(position.x, position.y, 0);
            }
            //右足首
            if(keypoint.part == "rightAnkle"){
                let position = calcPosition(keypoint);
                rightAnkle.position.set(position.x, position.y, 0);
            }
        });
    }

    //部位の位置を計算する
    function calcPosition(keypoint){
        let x = keypoint.position.x;
        let y = keypoint.position.y;
        let centerX = (-1 * (x - videoWidth / 2) / (videoWidth / 2) * zOffset);
        let centerY = ((y - videoHeight / 2) / (videoHeight / 2) * zOffset);
        return new THREE.Vector2(centerX, centerY);
    }

    //検出したスケルトンを描画する
    function detectAndDraw(net){
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        net.estimateSinglePose(video,{
            flipHorizontal: false,
        })
        .then(function(pose){
            drawSkelton(ctx, pose);
            drawLine(ctx, pose);
            threeDraw(pose)
        });
    }

    //検出した位置に円を描画する
    function drawSkelton(ctx, pose){
        pose.keypoints.forEach(function(keypoint){
            if(keypoint.score >= threshold){
                drawCircle(ctx, keypoint.position);
            }
        });
    }

    //円を描く
    function drawCircle(ctx, keypoint){
        const circle = new Path2D();
        const radius = 5;
        ctx.fillStyle = "#0f0";
        circle.arc(keypoint.x, keypoint.y, radius, 0, Math.PI * 2);
        ctx.fill(circle);
    }

    //円と円を線で繋ぐ
    function drawLine(ctx, pose){
        ctx.strokeStyle = "#0f0";
        ctx.lineWidth = 2;

        pose.keypoints.forEach(function(keypoint){
            //console.log(keypoint);
            //左手首と左肘の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "leftWrist"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[7].position.x, pose.keypoints[7].position.y);
                ctx.stroke();
            }
            //左肘と左肩の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "leftElbow"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[5].position.x, pose.keypoints[5].position.y);
                ctx.stroke();
            }
            //右手首と右肘の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "rightWrist"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[8].position.x, pose.keypoints[8].position.y);
                ctx.stroke();
            }
            //右肘と右肩の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "rightElbow"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[6].position.x, pose.keypoints[6].position.y);
                ctx.stroke();
            }
            if(keypoint.score >= threshold && keypoint.part == "leftShoulder"){
                //左肩と右肩の間に線を引く
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[6].position.x, pose.keypoints[6].position.y);
                ctx.stroke();
            }
            //左肩と左腰の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "leftShoulder"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[11].position.x, pose.keypoints[11].position.y);
                ctx.stroke();
            }
            //右肩と右腰の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "rightShoulder"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[12].position.x, pose.keypoints[12].position.y);
                ctx.stroke();
            }
            //左腰と左膝の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "leftHip"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[13].position.x, pose.keypoints[13].position.y);
                ctx.stroke();
            }
            //左膝と左足首の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "leftKnee"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[15].position.x, pose.keypoints[15].position.y);
                ctx.stroke();
            }
            //右腰と右膝の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "rightHip"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[14].position.x, pose.keypoints[14].position.y);
                ctx.stroke();
            }
            //右膝と右足首の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "rightKnee"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[16].position.x, pose.keypoints[16].position.y);
                ctx.stroke();
            }
            //左腰と右腰の間に線を引く
            if(keypoint.score >= threshold && keypoint.part == "leftHip"){
                ctx.beginPath();
                ctx.moveTo(keypoint.position.x, keypoint.position.y);
                ctx.lineTo(pose.keypoints[12].position.x, pose.keypoints[12].position.y);
                ctx.stroke();
            }
        });
    }

    //エントリーポイント
    threeSetup(webGLCanvas);

    //カメラの映像を取得する
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    }).then(function(mediaStream){
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e){
            video.play();
        };
        return posenet.load();
    }).then(function(net){
        setInterval(function(){
            detectAndDraw(net);
            
        }, 100);
    })
    .catch(function (err){
        console.log("エラー");
    });

    //ブラウザをリサイズした時の挙動
    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth,window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize);
});

