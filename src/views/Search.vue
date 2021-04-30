<template>
  <v-card width="1200px" class="mx-auto mt-5">
    <v-card-title>
      <h2 class="text-center">Search</h2>
      <v-spacer></v-spacer>
      <v-switch
        v-model="isAdvancedMode"
        label="拡張検索"
        color="accent"
        hide-details
      ></v-switch>
    </v-card-title>
    <v-card-text>
      <v-form v-show="!isAdvancedMode">
        <v-text-field
          v-model="freeSearch"
          class="ma-4"
          prepend-icon="mdi-form-textbox"
          label="自由検索"
          clearable
          hide-details
        ></v-text-field
      ></v-form>
      <v-form v-show="isAdvancedMode" class="ma-4"
        ><v-row>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="id"
              prepend-icon="mdi-qrcode"
              label="備品コード"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="name"
              prepend-icon="mdi-form-textbox"
              label="品名"
              clearable
              hide-details
            ></v-text-field> </v-col></v-row
        ><v-row>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="model"
              prepend-icon="mdi-numeric"
              label="型番"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="manufacture"
              prepend-icon="mdi-domain"
              label="メーカー"
              clearable
              hide-details
            ></v-text-field> </v-col></v-row
        ><v-row>
          <v-col cols="12" sm="12" md="6">
            <v-autocomplete
              v-model="tags"
              label="タグ"
              chips
              :items="tagChoices"
              prepend-icon="mdi-tag"
              clearable
              deletable-chips
              small-chips
              multiple
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="parent"
              label="親備品"
              chips
              prepend-icon="mdi-qrcode-scan"
              maxlength="6"
              clearable
              deletable-chips
              multiple
            ></v-text-field> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-checkbox
              v-model="isTakingOut"
              label="貸出中のみ"
              color="accent"
            ></v-checkbox
          ></v-col>
          <v-col>
            <v-checkbox
              v-model="isRemoved"
              label="除籍済を含む"
              color="accent"
            ></v-checkbox
          ></v-col>
        </v-row>
      </v-form>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="filteredEquipos"
        item-key="id"
        :search="freeSearch"
        multi-sort
        :items-per-page="100"
        class="row-pointer"
      >
        <template v-slot:item.isTakingOut="{ item }">
          <v-simple-checkbox
            v-model="item.isTakingOut"
            disabled
          ></v-simple-checkbox>
        </template>
        <template v-slot:item.isRemoved="{ item }">
          <v-simple-checkbox
            v-model="item.isRemoved"
            disabled
          ></v-simple-checkbox>
        </template> </v-data-table
    ></v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import { Equipo, Config } from "@/models";

export default Vue.extend({
  name: "Search",
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
          text: "貸出中",
          align: "center",
          sortable: true,
          value: "isTakingOut",
        },
        {
          text: "除籍済",
          align: "center",
          sortable: true,
          value: "isRemoved",
        },
      ],
      equipos: [] as Equipo[],
      equiposCol: firebase.firestore().collection("equipos"),
      freeSearch: "",
      isAdvancedMode: false,

      id: "",
      name: "",
      model: "",
      parent: "",
      manufacture: "",
      tags: [] as string[],
      tagChoices: [] as string[],
      configDoc: firebase.firestore().collection("config").doc("config"),
      isTakingOut: false,
      isRemoved: false,
    };
  },
  async mounted() {
    this.tagChoices = ((await this.configDoc.get()).data() as Config).tags;
    this.equiposCol.onSnapshot((snapshot) => {
      this.equipos = snapshot.docs.map((doc) => doc.data() as Equipo);
    });
  },
  components: {},
  methods: {},
  computed: {
    filteredEquipos(): Equipo[] {
      return this.equipos
        .filter((e) => !e.isRemoved || this.isRemoved)
        .filter((e) => !this.isTakingOut || e.isTakingOut)
        .filter((e) => new RegExp(this.id).test(e.id))
        .filter((e) => new RegExp(this.name).test(e.name))
        .filter((e) => new RegExp(this.model).test(e.model))
        .filter((e) => new RegExp(this.manufacture).test(e.manufacture))
        .filter((e) => this.tags.every((tag) => e.tags.includes(tag)))
        .filter((e) => {
          if (!this.parent.match(/^[A-Z]-\d{4}$/)) return true;
          if (e.location?.path.split("/")[1] == this.parent) return true;
          return false;
        });
    },
  },
  watch: {
    isAdvancedMode() {
      this.id = "";
      this.name = "";
      this.model = "";
      this.parent = "";
      this.manufacture = "";
      this.tags = [];
      this.isTakingOut = false;
      this.isRemoved = false;
    },
  },
});
</script>
