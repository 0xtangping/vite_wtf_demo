  <template>
    <div>
      <h2>文章管理</h2>

      <!-- 获取文章表单 -->
      <div>
        <h3>获取文章</h3>
        <div v-if="fetchedArticle">
          <h4>文章内容</h4>
          <p><strong>ID：</strong>{{ fetchedArticle.id }}</p>
          <p><strong>标题：</strong>{{ fetchedArticle.title }}</p>
          <p><strong>作者：</strong>{{ fetchedArticle.author }}</p>
          <p><strong>内容：</strong>{{ fetchedArticle.content }}</p>
          <p><strong>创建时间：</strong>{{ fetchedArticle.created_at }}</p>
          <p><strong>更新时间：</strong>{{ fetchedArticle.updated_at }}</p>
        </div>
      </div>

      <!-- 更新文章表单 -->
      <div>
        <h3>更新文章</h3>
        <input v-model="updateArticle.title" placeholder="新标题" />
        <textarea v-model="updateArticle.content" placeholder="新内容"></textarea>
        <button @click="updateArticleData">更新</button>
      </div>

      <!-- 删除文章表单 -->
      <div>
        <h3>删除文章</h3>
        <button @click="deleteArticle">删除</button>
      </div>
    </div>
  </template>

  <script>
  import { ref, watch, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';


  export default {
    setup() {
      // 定义状态
      const updateArticle = ref({
        id: '',
        title: '',
        content: ''
      });
      
      const token = localStorage.getItem('token');
      const fetchedArticle = ref(null);
      const route = useRoute();
      const articleId = ref(route.params.id);

      // 监听路由变化，以便在 id 改变时更新组件内容
      watch(() => route.params.id, (newId) => {
        articleId.value = newId;
        getArticle(); // 当 id 变化时自动获取文章
      });

      // 获取文章
      const getArticle = async () => {
        try {
          const response = await axios.get(`https://shopify.xyz/api/articles/${articleId.value}`);
          fetchedArticle.value = response.data;
        } catch (error) {
          console.error('Error:', error);
        }
      };

      // 更新文章
      const updateArticleData = async () => {
        try {
          const response = await axios.put(`https://shopify.xyz/api/articles/${articleId.value}`, {
            title: updateArticle.value.title,
            content: updateArticle.value.content
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Article updated:', response.data);
          window.alert('更新成功');
        } catch (error) {
          console.error('Error:', error);
          window.alert(`更新失败:${response.data}`);
        }
      };

      // 删除文章
      const deleteArticle = async () => {
        try {
          const response = await axios.delete(`https://shopify.xyz/api/articles/${articleId.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Article deleted:', response.data);
          window.alert('删除成功');
        } catch (error) {
          console.error('Error:', error);
          window.alert(`删除失败:${response.data}`);
        }
      };


      // 获取文章在组件挂载时
      onMounted(() => {
        getArticle();
      });

      // 返回定义的数据和方法
      return {
        articleId,
        updateArticle,
        fetchedArticle,
        updateArticleData,
        getArticle,
        deleteArticle
      };
    }
  };
  </script>
