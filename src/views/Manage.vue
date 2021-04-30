<template>
  <div class="text-center">
    <v-card width="1200px" class="mx-auto mt-5">
      <v-card-title>
        Manage Equipos

        <v-divider class="mx-4" vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          clearable
          hide-details
        ></v-text-field>
        <v-dialog v-model="newDialog" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              x-large
              color="accent"
              class="ml-4"
              dark
              v-bind="attrs"
              v-on="on"
              >新規追加</v-btn
            >
          </template>
          <EquipoForm
            type="new"
            :initialEquipo="selectedEquipo"
            @submit="submitForm"
            @close="close"
          ></EquipoForm>
        </v-dialog>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="equipos"
        item-key="id"
        :search="search"
        multi-sort
        :items-per-page="100"
        @click:row="onClickRow"
        class="row-pointer"
      >
        <template v-slot:item.isTakingOut="{ item }">
          <v-simple-checkbox
            v-model="item.isTakingOut"
            disabled
          ></v-simple-checkbox>
        </template>
      </v-data-table>

      <v-dialog v-model="editDialog" max-width="600px">
        <EquipoForm
          type="edit"
          :initialEquipo="selectedEquipo"
          @submit="submitForm"
          @close="close"
        ></EquipoForm>
      </v-dialog>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import { Equipo } from "@/models";
import EquipoForm from "@/components/EquipoForm.vue";

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
          align: "center",
          sortable: true,
          value: "isTakingOut",
        },
      ],
      equipos: [] as Equipo[],
      equiposCol: firebase.firestore().collection("equipos"),
      search: "",
      newDialog: false,
      editDialog: false,
      selectedEquipo: new Equipo(),
    };
  },
  async mounted() {
    this.equiposCol.onSnapshot((snapshot) => {
      this.equipos = snapshot.docs.map((doc) => doc.data() as Equipo);
    });
  },
  components: { EquipoForm },
  methods: {
    onClickRow(item: Equipo) {
      this.selectedEquipo = item;
      this.editDialog = true;
    },
    submitForm(e: Equipo) {
      const equipo = new Equipo(e);
      this.equiposCol.doc(equipo.id).set(equipo.toObject());
      this.close();
    },
    close() {
      this.selectedEquipo = new Equipo();
      this.editDialog = false;
      this.newDialog = false;
    },
  },
});
</script>

<style lang="stylus" scoped>
.row-pointer >>> tbody tr {
  cursor: pointer;
}
</style>
