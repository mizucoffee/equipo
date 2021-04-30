<template>
  <div class="text-center">
    <v-btn x-large color="accent" class="ma-2" dark to="/manage/new"
      >新規追加</v-btn
    >
    <v-card width="1200px" class="mx-auto mt-5">
      <v-card-title>
        Manage Equipos
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          clearable
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="equipos"
        item-key="id"
        :search="search"
        multi-sort
        :items-per-page="100"
      >
        <template v-slot:item.isTakingOut="{ item }">
          <v-simple-checkbox
            v-model="item.isTakingOut"
            disabled
          ></v-simple-checkbox>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import { Equipo } from "@/models";

export default Vue.extend({
  name: "Manage",
  data() {
    return {
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "品名",
          align: "start",
          sortable: true,
          value: "name",
        },
        {
          text: "型番",
          align: "start",
          sortable: true,
          value: "model",
        },
        {
          text: "メーカー",
          align: "start",
          sortable: true,
          value: "manufacture",
        },
        {
          text: "持ち出し中",
          align: "start",
          sortable: true,
          value: "isTakingOut",
        },
      ],
      equipos: [] as Equipo[],
      equiposCol: firebase.firestore().collection("equipos"),
      search: "",
    };
  },
  async mounted() {
    this.equiposCol.onSnapshot((snapshot) => {
      this.equipos = snapshot.docs.map((doc) => doc.data() as Equipo);
    });
  },
  components: {},
});
</script>
