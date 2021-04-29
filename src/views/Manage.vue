<template>
  <div class="text-center">
    <v-btn x-large color="accent" class="ma-2" dark to="/manage/new"
      >新規追加</v-btn
    >
    <v-card width="1200px" class="mx-auto mt-5">
      <v-data-table
        :headers="headers"
        :items="equipos"
        item-key="id"
        :items-per-page="100"
      >
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
    };
  },
  async mounted() {
    const equiposSnapshot = await this.equiposCol.get();
    this.equipos = equiposSnapshot.docs.map((doc) => doc.data() as Equipo);
  },
  components: {},
});
</script>
