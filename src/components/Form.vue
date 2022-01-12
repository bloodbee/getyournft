<script>
import { ref } from 'vue'
import { useStore } from 'vuex';

export default {
  name: 'FormComponent',
  computed: {
    isLoading() {
      return this.$store.state.loading
    },
  },
  setup() {
    const assetUrl = ref(null)
    const msg = ref(null)

    const store = useStore()

    store.commit('setLoading', false)

    return {
      assetUrl,
      msg,
      async formSubmitted() {
        store.commit('setLoading', true)

        msg.value = null
        const url = assetUrl.value

        // get nft
        const nft = await store.dispatch('getNft', url)

        // error
        if ('status' in nft && nft.status === 'error') {
          msg.value = nft.msg
        } else {
          // download the image to user's computer
          const image = await fetch(nft.assetUrl)
          const blob = await image.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${nft.tokenAddress}_${nft.tokenId}.png`
          a.click()
        }
        // reset the form
        store.commit('setLoading', false)
        assetUrl.value = null
      }
    }
  }
}

</script>

<template>
  <div class="form-container">
    <form v-if="!isLoading">
      <input v-model="assetUrl" type="text" placeholder="Enter an asset URL" />

      <button @click.prevent="formSubmitted" type="submit">Download</button>
    </form>
    <div class="error-text" v-if="msg"><b>{{ msg }}</b></div>
    <div v-if="isLoading">
      Your NFT is downloading...
    </div>
  </div>
</template>

<style scoped>

.form-container {
  margin-top: 50px;
  margin-bottom: 50px;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}

form {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 10px;
}

input {
  height: 30px;
  width: 70%;
  border-radius: 0;
  border: 1px solid rgb(27, 139, 204);
  padding-left: 10px;
  padding-right: 10px;
}

input:focus-visible {
  outline-color: rgb(27, 139, 204);
  outline-style: solid;
}

button {
  height: 32.5px;
  border-radius: 0;
  width: 20%;
  background-color: rgb(27, 139, 204);
  color: white;
  font-weight: bold;
  border: none;
}

button:hover {
  cursor: pointer;
}

@media screen and (max-width: 600px) {
  form {
    flex-direction: column;
  }
  
  input {
    width: 100%;
  }

  button {
    margin-top: 20px;
    width: 100%;
  }
}

</style>