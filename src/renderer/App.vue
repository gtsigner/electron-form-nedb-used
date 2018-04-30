<template>
  <div id="app">
    <ul class="nav nav-bar">
      <li class="nav-item">
        <router-link class="nav-link" to="/">首页</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="record">数据</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="settings">设置</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="export">导出</router-link>
      </li>
    </ul>
    <div class="main-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'form-app'
  }
</script>

<style lang="scss">
  /* CSS */

  .nav-bar {
    height: 50px;
    line-height: 30px;
    position: fixed;
    width: 100%;
    background: #000;
    .nav-link {
      color: #ffffff;
      outline: none;
      &:active {
        outline: none;
      }
    }
  }

  .main-body {
    padding: 50px 0;
  }
</style>
