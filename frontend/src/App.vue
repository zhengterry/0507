<template>
  <div class="app-container">
    <PipelineTask />
  </div>
</template>

<script setup>
import PipelineTask from './components/PipelineTask.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}
</style>