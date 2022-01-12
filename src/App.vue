<template>
  <h1>Get Your NFT</h1>
  <subtitle>Download your NFT from your favorite marketplace</subtitle>
  
  <p>Marketplace supported : <b>Opensea</b></p>
  <p class="warning-text">Warning : It works best if the nft is stored on <b>IPFS</b></p>
  
  <Form></Form>

  <hr>
  <p>You can find the repository on <a href="https://github.com/bloodbee/getyournft" target="_blank">github</a></p>
  <p>Any inquiries, please contact me <a href="mailto:mathieu@bloodbee.space">mathieu@bloodbe.space</a></p>
</template>

<script>
import Form from './components/Form.vue'

export default {
  name: 'App',
  components: {
    Form
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


h1 {
  color: rgb(27, 139, 204);
}

.warning-text {
  color: rgb(209, 170, 41);
} 

.error-text {
  color: rgb(212, 30, 30);
}
</style>
