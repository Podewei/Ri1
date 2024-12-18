
function enter_problems(){
    document.getElementById('first_container').addEventListener('click', function(event) {
        const loadingScreen = document.getElementById('loading-screencg');
        loadingScreen.style.display = 'flex'; // 显示加载屏幕
    
        // 禁用点击事件
        document.getElementById('first_container').style.pointerEvents = 'none';
    
        // 3秒后进行跳转
        setTimeout(() => {
            window.location.href = 'question.html'; // 替换为目标页面的 URL
        }, 3000); // 3000ms = 3s
    });
}