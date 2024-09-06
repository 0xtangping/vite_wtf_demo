<template>
  <div>
    <h1>Login</h1>
    
    <!-- 以太坊登录 -->
    <button v-if="!isLoggedIn" @click="loginWithEthereum">Login with Ethereum</button>

    <!-- GitHub 登录 -->
    <button v-if="!isLoggedIn" @click="loginWithGitHub">Login with GitHub</button>
    
    <!-- 如果已登录，显示登出按钮 -->
    <button v-if="isLoggedIn" @click="logout">Logout</button>
    
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { ethers } from 'ethers';


export default {
  setup() {
    // 检查是否已登录
    const error = ref(null);
    const token = ref(localStorage.getItem('token'));
    const isLoggedIn = computed(() => {
      return !!token.value;
    });
    
    // 处理以太坊登录
    const loginWithEthereum = async () => {
      try {
        // 检查是否安装了以太坊钱包（例如 MetaMask）
        if (typeof window.ethereum !== 'undefined') {
          console.log('Detected Ethereum provider');

          // 创建 Web3Provider 实例
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // 请求用户授权访问他们的以太坊账户
          const accounts = await provider.send('eth_requestAccounts', []);
          
          if (accounts.length === 0) {
            throw new Error('No Ethereum accounts found');
          }

          // 获取签名者（当前账户）
          const signer = await provider.getSigner();

          // 获取用户的以太坊地址
          const address = await signer.getAddress();

          // 生成消息字符串以供签名
          const message = "Login to our app";

          // 获取用户的签名
          const signature = await signer.signMessage(message);

          // 向服务器发送登录请求
          const response = await axios.post('/api/login/ethereum', {
            address,
            signature,
            message
          });

          // 保存 JWT
          localStorage.setItem('token', response.data.token);
          token.value = response.data.token;
        } else {
          throw new Error('Please install MetaMask or enable another Ethereum wallet extension');
        }
      } catch (err) {
        error.value = 'Ethereum login failed: ' + (err.response?.data?.message || err.message);
      }
    };


    // 处理GitHub登录
    const loginWithGitHub = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code'); // 从URL中获取GitHub的code参数
        if (!code) {
          // 如果没有code参数，重定向到GitHub授权页面
          const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
          const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;
          const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
          window.location.href = githubAuthUrl;
        } else{
          // 如果URL中有code参数，向后端发送请求
          const response = await axios.post('/api/login/github', {
            code
          });

          // 保存 JWT
          localStorage.setItem('token', response.data.token);
          token.value = response.data.token;

          // 移除 URL 中的 code 参数
          window.history.replaceState({}, document.title, window.location.pathname);
      }
      } catch (err) {
        error.value = 'GitHub login failed: ' + (err.response?.data?.message || err.message);
      }
    };

    // 处理登出
    const logout = () => {
      // 清除 JWT 并更新 token 状态
      localStorage.removeItem('token');
      token.value = null;
      console.log('Logged out');
    };

    // 页面加载时检查是否需要处理GitHub登录
    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        loginWithGitHub(code);
      }
    });

    return {
      isLoggedIn,
      error,
      logout,
      loginWithEthereum,
      loginWithGitHub
    };
  }
};
</script>

<style scoped>
</style>
