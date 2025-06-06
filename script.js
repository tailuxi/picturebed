document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reportForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const fileInput = document.getElementById('screenshot');
    const fileName = document.getElementById('fileName');
    
    // 显示选择的文件名
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = '未选择文件';
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 显示加载状态
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        
        // 清除之前的消息
        messageDiv.textContent = '';
        messageDiv.className = 'loading';
        messageDiv.style.display = 'block';
        messageDiv.textContent = '正在提交举报，请稍候...';
        
        const playerName = document.getElementById('playerName').value;
        const reporterName = document.getElementById('reporterName').value;
        const reporterEmail = document.getElementById('reporterEmail').value;
        const reason = document.getElementById('reason').value;
        const description = document.getElementById('description').value;
        const screenshot = document.getElementById('screenshot').files[0];
        
        const formData = new FormData();
        formData.append('_subject', 'Minecraft服务器举报 - ' + playerName);
        formData.append('被举报玩家', playerName);
        formData.append('举报人', reporterName);
        formData.append('举报人邮箱', reporterEmail || '未提供');
        formData.append('举报原因', reason);
        formData.append('详细描述', description);
        
        // 添加回复地址（如果提供了邮箱）
        if (reporterEmail) {
            formData.append('_replyto', reporterEmail);
        }
        
        if (screenshot) {
            formData.append('screenshot', screenshot);
        }
        
        // 使用FormSubmit.co服务发送邮件
        fetch("https://formsubmit.co/ajax/1354854193@qq.com", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
        .then(data => {
            // 显示成功消息
            messageDiv.className = 'success';
            
            if (reporterEmail) {
                messageDiv.innerHTML = `
                    <h3>举报提交成功！</h3>
                    <p>感谢你的举报，我们已经收到关于 <strong>${playerName}</strong> 的举报信息。</p>
                    <p>我们的管理团队会尽快审核处理，处理结果将发送到你的邮箱: <strong>${reporterEmail}</strong></p>
                    <p>举报ID: ${generateRandomId()}</p>
                `;
            } else {
                messageDiv.innerHTML = `
                    <h3>举报提交成功！</h3>
                    <p>感谢你的举报，我们已经收到关于 <strong>${playerName}</strong> 的举报信息。</p>
                    <p>我们的管理团队会尽快审核处理。</p>
                    <p>举报ID: ${generateRandomId()}</p>
                    <p class="privacy-note"><i class="fas fa-info-circle"></i> 注意: 由于你未提供邮箱地址，我们将无法向你反馈处理结果</p>
                `;
            }
            
            // 重置表单
            form.reset();
            fileName.textContent = '未选择文件';
            
            // 5秒后淡出成功消息
            setTimeout(() => {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                    messageDiv.style.opacity = '1';
                }, 500);
            }, 5000);
        })
        .catch(error => {
            console.error('Error:', error);
            messageDiv.className = 'error';
            messageDiv.innerHTML = `
                <h3>提交失败</h3>
                <p>抱歉，提交过程中出现了问题: ${error.message}</p>
                <p>请检查你的网络连接后重试，或联系服务器管理员。</p>
            `;
        })
        .finally(() => {
            // 重置按钮状态
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        });
    });
    
    // 生成随机举报ID
    function generateRandomId() {
        return 'MC-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
});
