<script setup>
import { ref } from "vue";

const queryData = ref();
const firstName = ref();
const lastName = ref();

const message = ref();

 async function load() {
    try {
      const response = await fetch("/api/load", { method: "PUT"});
      console.log(await response.json());
      message.value = "Load is done!"
    }
    catch (e) {
      message.value = "Something went wrong with Load:("
    }
    
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
    // else, if no first and last name is entered
    // all data from the Azure Table will be displayed

    try {
      const response = await fetch("/api/query" + queryString); // { method: "GET"}
      //console.log(await response.json());
      let responseJson = await response.json();

      let responseBody = responseJson.body;

      let modifiedJson = responseBody.map( (value) => {
        let {etag, timestamp, partitionKey, rowKey, ...modifiedEntry} = value; 
        modifiedEntry = { name: `${value.partitionKey} ${value.rowKey}`, ...modifiedEntry};
        return modifiedEntry;
      })

      queryData.value = modifiedJson;

      if(queryData.value.length == 0){
        message.value = "Your entered data isn't in the database:("
      }
      else {
        message.value = "Querying is done!"
      }

    }
    catch (e) {
      console.log("Error");
    }
  }

  async function clear() {
    try {
      const response = await fetch("/api/clear", { method: "DELETE"});
      queryData.value = undefined;
      console.log(await response.json());
      message.value = "Data is cleared"
    }
    catch (e) {
      message.value = "Clear didn't work:("
    }  
    }
</script>

<template>
  <h1>Veronika Bykova - Program 4, Web API storage (CSS 436)</h1>
  <div style="display: flex; justify-content: center; padding-top: 20px; font-size: large;">
    {{ message }}
  </div>
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
      <input v-model="firstName" type="text" name="first" id="first" placeholder="Type first name here">
    </p>
    <p>
      <label for="last">Last Name: </label>
      <input v-model="lastName" type="text" name="last" id="last" placeholder="Type last name here">
    </p>
  </div>
  <div class="btn">
      <button v-on:click="query" class="query-btn">Query</button>
  </div>
  <div style="display: flex; justify-content: center; padding-top: 20px;">
  <ul id="displayedJSON">
      <li v-for="item in queryData" class="no-bullets">
        {{ item.name }}
        <div v-for="(value, key) in item">
          <li style="margin-left: 40px"  class="bullets" v-if="key !== 'name'">
            {{ key }}: {{ value }}
          </li>
        </div>
        <hr>
      </li>
    </ul>
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
  margin-top: 50px;
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

.no-bullets {
  list-style-type: none;
}

.bullets {
  list-style-type: circle;
}
</style>
