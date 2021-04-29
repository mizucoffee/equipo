<template>
  <v-card width="600px" class="mx-auto mt-5">
    <v-card-title>
      <h2 class="text-center">返却</h2>
    </v-card-title>
    <v-card-text>
      <v-alert :type="type" v-show="message">{{ message }}</v-alert>
      <v-form @submit.prevent>
        <v-text-field
          v-model="id"
          prepend-icon="mdi-qrcode"
          label="備品コード"
          required
          maxlength="6"
          @keyup.enter="returnEquipo()"
          id="idTextField"
        ></v-text-field>
        <v-card-actions>
          <v-btn class="mr-4" @click="returnEquipo">Submit</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import { Equipo } from "@/models";

export default Vue.extend({
  name: "Return",
  data() {
    return {
      id: "",
      equiposCol: firebase.firestore().collection("equipos"),
      message: "",
      type: "info",
    };
  },
  components: {},
  watch: {
    async id(id) {
      this.id = id.toUpperCase();
    },
  },
  methods: {
    async returnEquipo() {
      if (!this.id.match(/^[A-Z]-\d{4}$/)) {
        this.type = "error";
        this.message = `「${this.id}」は正しい備品コードではありません`;
        (document.querySelector("#idTextField") as HTMLInputElement).select();
        return;
      }

      this.type = "info";
      this.message = "返却処理中...";
      const equipoSnapshot = await this.equiposCol.doc(this.id).get();
      if (!equipoSnapshot.exists) {
        this.type = "error";
        this.message = `「${this.id}」は登録されていません`;
        (document.querySelector("#idTextField") as HTMLInputElement).select();
        return;
      }

      const equipo = new Equipo(equipoSnapshot.data());

      if (equipo.isTakingOut) {
        equipo.isTakingOut = false;
        this.equiposCol.doc(this.id).set(equipo.toObject());
        this.type = "success";
        this.message = `「${equipo.name}」を返却しました`;
      } else {
        this.type = "warning";
        this.message = `「${equipo.name}」は貸出されていません`;
      }
      (document.querySelector("#idTextField") as HTMLInputElement).select();
    },
  },
});
</script>
