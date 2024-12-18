window.onload = function() {
    const loadingScreen = document.getElementById('loading-screen');
    const content = document.getElementById('content');

    setTimeout(() => {
        loadingScreen.classList.add('fade-out'); // 添加渐隐类
        setTimeout(() => {
            loadingScreen.style.display = 'none'; // 隐藏加载屏幕
            content.style.display = 'block'; // 显示主内容
        }, 2000); // 两秒后隐藏
    }, 3000); // 三秒后执行
};