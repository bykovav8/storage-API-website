<script setup>
import { ref } from "vue";

const queryData = ref({ name: "John"});
const firstName = ref();
const lastName = ref();


 async function load() {
    const response = await fetch("/api/load", { method: "PUT"});
    console.log(await response.json());
  }

  async function query() {
    let queryString = "";

    if(firstName.value && lastName.value) {
      queryString = `?firstName=${firstName.value}&lastName=${lastName.value}`;
    }
    else if(firstName.value){
      queryString = `?firstName=${firstName.value}`;
    }
    else if(lastName.value) {
      queryString = `?lastName=${lastName.value}`;
    }
    else {
      console.log("No data was entered");
    }

    try {
      const response = await fetch("/api/query" + queryString); // { method: "GET"}
      //console.log(await response.json());
      queryData.value = await response.json();
    }
    catch (e) {
      console.log("Error");
    }
  }

  async function clear() {
    const response = await fetch("/api/clear", { method: "DELETE"});
    console.log(await response.json());
  }
</script>

<template>
  <h1>Veronika Bykova - Program 4, Web API storage (CSS 436)</h1>
  <div class="btns">
    <div>
      <button v-on:click="load" class="load-btn">Load Data</button>
    </div>
    <div>
      <button v-on:click="clear" class="clear-btn">Clear Data</button>
    </div>
  </div>
  <div class="input">
    <p>
      <label for="first">First Name: </label>
      <input v-model="firstName" type="text" name="first" id="first">
    </p>
    <p>
      <label for="last">Last Name: </label>
      <input v-model="lastName" type="text" name="last" id="last">
    </p>
  </div>
  <div class="btn">
      <button v-on:click="query" class="query-btn">Query</button>
  </div>
  <div style="display: flex; justify-content: center; padding-top: 40px;">
    {{ queryData }}
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-top: 40px;
  color: rgb(228, 99, 228);
}

button {
  height: 50px;
  width: 80px;
  font-size: 18px;
  font-weight: bold;
}

.btns {
  margin-top: 60px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  gap: 100px;
}

.input {
  display: flex;
  justify-content: center;
  gap: 50px;
  color: rgb(232, 121, 232);
  font-size: medium;
}

.btn {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.load-btn {
  background-color: rgb(251, 251, 102);
}

.query-btn {
  background-color: rgb(136, 224, 136);
}

.clear-btn {
  background-color: rgb(115, 224, 224);
}

</style>
