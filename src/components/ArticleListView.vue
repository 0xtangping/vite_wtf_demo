<template>
  <div>
    <h1>Articles</h1>
    <ul>
      <li v-for="article in articles" :key="article.id">
        <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
      </li>
    </ul>
  </div>

  <!-- 创建文章表单 -->
  <div>
      <h3>创建文章</h3>
      <input v-model="newArticle.title" placeholder="标题" />
      <input v-model="newArticle.author" placeholder="作者" />
      <textarea v-model="newArticle.content" placeholder="内容"></textarea>
      <button @click="createArticle">创建</button>
  </div>
  
</template>

<script>
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const articles = ref([]);
    const token = localStorage.getItem('token');

    const newArticle = ref({
      title: '',
      author: '',
      content: ''
    });

    const fetchArticles = async () => {
      try {
        const response = await axios.get('/api/articles',{
          params: {
            limit: 10,   // 你希望每页显示的记录数量
            page: 1   // 你希望请求的页码
          }
        });
        if (response.data && response.data.articles) {
          articles.value = response.data.articles;
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    // 创建文章
    const createArticle = async () => {
      try {
        const response = await axios.post('https://shopify.xyz/api/articles', newArticle.value,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        window.alert('创建成功');
      } catch (error) {
        window.alert(`创建失败:${response.data}`);
      }
    };

    onMounted(() => {
      fetchArticles();
    });

    return { 
      articles,
      newArticle,
      createArticle,
     };
  },
};
</script>
