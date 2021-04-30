<template>
  <div>
    <v-card width="600px" class="mx-auto mt-5">
      <v-card-title>
        <h2 class="text-center">貸出</h2>
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
            @keyup.enter="takingOutEquipo()"
            id="idTextField"
          ></v-text-field>
          <v-card-actions>
            <v-btn class="mr-4" @click="takingOutEquipo">Submit</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import { Equipo } from "@/models";

export default Vue.extend({
  name: "TakingOut",
  data() {
    return {
      id: "",
      equiposCol: firebase.firestore().collection("equipos"),
      message: "",
      type: "info",
    };
  },
  components: {},
  mounted() {
    (document.querySelector("#idTextField") as HTMLInputElement).select();
  },
  watch: {
    async id(id) {
      this.id = id.toUpperCase();
    },
  },
  methods: {
    async takingOutEquipo() {
      if (!this.id.match(/^[A-Z]-\d{4}$/)) {
        this.type = "error";
        this.message = `「${this.id}」は正しい備品コードではありません`;
        (document.querySelector("#idTextField") as HTMLInputElement).select();
        return;
      }

      this.type = "info";
      this.message = "貸出処理中...";
      const equipoSnapshot = await this.equiposCol.doc(this.id).get();
      if (!equipoSnapshot.exists) {
        this.type = "error";
        this.message = `「${this.id}」は登録されていません`;
        (document.querySelector("#idTextField") as HTMLInputElement).select();
        return;
      }

      const equipo = new Equipo(equipoSnapshot.data());

      if (!equipo.isTakingOut) {
        equipo.isTakingOut = true;
        this.equiposCol.doc(this.id).set(equipo.toObject());
        this.type = "success";
        this.message = `「${equipo.name}」を貸出しました`;
      } else {
        this.type = "warning";
        this.message = `「${equipo.name}」は貸出されています`;
      }
      (document.querySelector("#idTextField") as HTMLInputElement).select();
    },
  },
});
</script>
