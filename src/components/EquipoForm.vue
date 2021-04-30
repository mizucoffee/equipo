<template>
  <v-card width="600px" class="mx-auto mt-5">
    <v-card-title>
      <h2 class="text-center">{{ title }}</h2>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="equipo.id"
          prepend-icon="mdi-qrcode"
          label="備品コード"
          required
          maxlength="6"
          :rules="[rules.required]"
          :error-messages="idError"
          :disabled="this.type != 'new'"
        ></v-text-field>
        <v-combobox
          v-model="equipo.tags"
          :items="tagChoices"
          prepend-icon="mdi-tag"
          label="タグ"
          multiple
          chips
          required
          clearable
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click:close="removeTag(item)"
            >
              <strong>{{ item }}</strong>
            </v-chip>
          </template>
        </v-combobox>
        <v-text-field
          v-model="equipo.model"
          prepend-icon="mdi-numeric"
          label="型番"
          required
        ></v-text-field>
        <v-text-field
          v-model="equipo.name"
          prepend-icon="mdi-form-textbox"
          label="品名"
          required
        ></v-text-field>
        <v-text-field
          v-model="equipo.manufacture"
          prepend-icon="mdi-domain"
          label="メーカー"
          required
        ></v-text-field>
        <v-autocomplete
          v-model="equipo.location"
          prepend-icon="mdi-map-marker"
          label="保管場所"
          required
          :items="locationChoices"
          item-text="text"
          item-value="ref"
        ></v-autocomplete>
        <v-textarea
          v-model="equipo.notes"
          prepend-icon="mdi-note-text"
          label="備考"
          required
          rows="1"
        ></v-textarea>

        <v-card-actions>
          <v-btn @click="close">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="submit"
            :disabled="this.idError != '' || this.equipo.id == ''"
            color="accent"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import { Config, Equipo, Location } from "@/models";

export default Vue.extend({
  name: "Manage",
  props: ["type", "initialEquipo"],
  data: function () {
    return {
      equipo: this.initialEquipo || new Equipo(),

      tagChoices: [] as string[],
      locationChoices: [] as Location[],
      configDoc: firebase.firestore().collection("config").doc("config"),
      equiposCol: firebase.firestore().collection("equipos"),
      idError: "",
      rules: {
        required: (value: string) => !!value || "この項目は必須です",
      },
    };
  },
  computed: {
    title: function () {
      return this.type == "new" ? "New Equipo" : "Edit Equipo";
    },
  },
  async mounted() {
    this.tagChoices = ((await this.configDoc.get()).data() as Config).tags;

    this.locationChoices = (await this.equiposCol.get()).docs.map((doc) => {
      const equipo = doc.data() as Equipo;
      return {
        ref: doc.ref,
        text: `${equipo.id}: ${equipo.name}`,
      } as Location;
    });
  },
  methods: {
    async submit() {
      const config = (await this.configDoc.get()).data() as Config;
      const tags = [...config.tags, ...this.equipo.tags];
      this.configDoc.set({ tags: [...new Set(tags)] });

      // validate

      this.$emit("submit", this.equipo);
      if (this.type == "new") this.equipo = new Equipo();
    },
    removeTag(tag: string) {
      this.equipo.tags.splice(this.equipo.tags.indexOf(tag), 1);
    },
    close(e: Event) {
      this.$emit("close", e);
    },
  },
  components: {},
  watch: {
    async "equipo.id"(id) {
      this.equipo.id = id.toUpperCase();

      if (!id.match(/^[A-Z]-\d{4}$/)) {
        this.idError = "IDが正しい形式ではありません";
        return;
      }
      if ((await this.equiposCol.doc(id).get()).exists && this.type == "new") {
        this.idError = "このIDは既に登録されています";
        return;
      }

      this.idError = "";
    },
    initialEquipo(newEquipo) {
      if (newEquipo.id) this.equipo = newEquipo;
    },
  },
});
</script>
