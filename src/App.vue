<template>
  <div id="app">
     <NavBar />
    <router-view/>
  </div>
</template>

<style>

</style>
<script>
import NavBar from './components/NavBar.vue'

export default {
 components: {
   NavBar
 }
}
</script>

